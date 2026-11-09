#!/usr/bin/env python3
"""Grant PostgreSQL traverse-only access to root-managed Muse parent dirs.

Do not chmod the platform-owned Muse home or grant access to unrelated files.
"""
import errno
import os
import pwd
import struct

ACL_VERSION = 2
USER_OBJ, USER, GROUP_OBJ, MASK, OTHER = 1, 2, 4, 16, 32
NO_ID = 0xFFFFFFFF
ACL_NAME = "system.posix_acl_access"
POSTGRES_UID = pwd.getpwnam("postgres").pw_uid


def entries(blob):
    if len(blob) < 4 or len(blob) % 8 != 4 or struct.unpack_from("<I", blob)[0] != ACL_VERSION:
        raise ValueError("Unsupported POSIX ACL data")
    return [list(struct.unpack_from("<HHI", blob, pos)) for pos in range(4, len(blob), 8)]


def grant_traverse(directory):
    stat_result = os.stat(directory)
    if not os.path.isdir(directory) or stat_result.st_uid != 0:
        raise ValueError("Refusing to change ownership or non-root-managed directory: " + directory)
    try:
        original = entries(os.getxattr(directory, ACL_NAME))
    except OSError as exc:
        if exc.errno != errno.ENODATA:
            raise
        group = (stat_result.st_mode >> 3) & 7
        original = [
            [USER_OBJ, (stat_result.st_mode >> 6) & 7, NO_ID],
            [GROUP_OBJ, group, NO_ID],
            [MASK, group, NO_ID],
            [OTHER, stat_result.st_mode & 7, NO_ID],
        ]

    current = next((item for item in original if item[0] == USER and item[2] == POSTGRES_UID), None)
    if current is None:
        original.insert(1, [USER, 1, POSTGRES_UID])
    else:
        current[1] = 1

    mask = next((item for item in original if item[0] == MASK), None)
    if mask is None:
        raise ValueError("Unsupported ACL without group/mask")
    # The postgres named-user entry needs execute permission through the ACL
    # mask. Do not widen the mask to all owning-group permissions.
    mask[1] |= 1

    blob = struct.pack("<I", ACL_VERSION) + b"".join(struct.pack("<HHI", *item) for item in original)
    os.setxattr(directory, ACL_NAME, blob)
    after = entries(os.getxattr(directory, ACL_NAME))
    assert any(tag == USER and perm == 1 and uid == POSTGRES_UID for tag, perm, uid in after)
    print("ACL traverse-only OK:", directory)


if __name__ == "__main__":
    for parent in ("/home/hatch", "/home/hatch/workspace"):
        grant_traverse(parent)
