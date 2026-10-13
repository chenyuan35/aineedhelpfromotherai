"""Real Chromium regression for Phone incoming legacy hashes and canonical route links.

Run after `npm --prefix frontend run build`:
  python3 scripts/test-phone-incoming-hash-browser.py
Requires an available local Chromium and Python Playwright. No production writes.
"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import os
import shutil

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'frontend' / 'dist'
ROUTE = 'giffgaff-uk-direct-esim-payg'
PLAN_SOURCE = 'https://help.giffgaff.com/en/articles/240912-getting-started-on-giffgaff'


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def assert_open(page, label):
    panel = page.locator('#directory-guide-panel')
    panel.wait_for(state='visible', timeout=30000)
    page.wait_for_function(
        "id => {const p=document.querySelector('#directory-guide-panel'); "
        "return p && !p.hidden && p.dataset.route === id && "
        "p.querySelector('h2') && !p.querySelector('.pr-loading')}",
        arg=ROUTE,
        timeout=30000,
    )
    assert 'giffgaff' in panel.inner_text().lower(), label
    assert panel.locator(f'a[href="{PLAN_SOURCE}"]').count() > 0, f'{label}: missing initial-plan source link'
    dims = page.evaluate('({view: innerWidth, doc: document.documentElement.scrollWidth, body: document.body.scrollWidth})')
    assert max(dims['doc'], dims['body']) <= dims['view'] + 2, f'{label}: horizontal overflow {dims}'
    assert not page.locator('.pr-error').count(), f'{label}: top-level load error'
    print(f'{label}: visible evidence, official link, no overflow — PASS')


def main():
    assert (DIST / 'tools/phone-number-survival-guide/index.html').exists(), 'frontend/dist missing; run frontend build'
    chromium = os.environ.get('PHONE_CHROMIUM_EXECUTABLE') or shutil.which('chromium') or shutil.which('chromium-browser')
    assert chromium, 'Chromium missing'
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(DIST)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}/tools/phone-number-survival-guide/'
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=chromium, headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
            try:
                for width in (320, 375, 390, 1280):
                    page = browser.new_page(viewport={'width': width, 'height': 850}, locale='en-US')
                    page.goto(f'{base}#route/{ROUTE}', wait_until='domcontentloaded', timeout=30000)
                    assert_open(page, f'incoming hash {width}px')
                    page.close()
                page = browser.new_page(viewport={'width': 375, 'height': 850})
                page.goto(f'{base}?route={ROUTE}', wait_until='domcontentloaded', timeout=30000)
                assert_open(page, 'query deep link 375px')
                page.goto(base, wait_until='domcontentloaded', timeout=30000)
                page.locator('#route-search').fill('giffgaff')
                page.locator(f'[data-index-route="{ROUTE}"]').first.click(timeout=30000)
                assert_open(page, 'in-page canonical evidence click 375px')
                page.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    main()
