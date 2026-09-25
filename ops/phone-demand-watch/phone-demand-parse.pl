use strict;
use warnings;
my ($source,$file)=@ARGV;
open my $fh,'<',$file or exit 2;
local $/;
my $xml=<$fh>;
sub clean {
  my $s=shift // '';
  $s =~ s/<!\[CDATA\[(.*?)\]\]>/$1/gs;
  $s =~ s/&lt;/</gi; $s =~ s/&gt;/>/gi; $s =~ s/&quot;/"/gi;
  $s =~ s/&#39;/'/gi; $s =~ s/&amp;/&/gi;
  $s =~ s/<[^>]+>/ /gs; $s =~ s/\s+/ /gs; $s =~ s/^\s+|\s+$//g;
  return $s;
}
sub trim_utf8_bytes {
  my ($s,$max)=@_;
  return $s if length($s) <= $max;
  $s=substr($s,0,$max);
  my $i=length($s)-1;
  while ($i >= 0 && (ord(substr($s,$i,1)) & 0xC0) == 0x80) { $i--; }
  return '' if $i < 0;
  my $lead=ord(substr($s,$i,1));
  my $need=1;
  $need=2 if $lead >= 0xC2 && $lead <= 0xDF;
  $need=3 if $lead >= 0xE0 && $lead <= 0xEF;
  $need=4 if $lead >= 0xF0 && $lead <= 0xF4;
  my $have=length($s)-$i;
  substr($s,$i)='' if $need > 1 && $have < $need;
  return $s;
}
sub mentioned_hosts {
  my ($raw,$src)=@_;
  my %skip=(
    reddit_phone => qr/(?:^|\.)reddit\.com$/i,
    nodeloc => qr/(?:^|\.)nodeloc\.com$/i,
    nodeseek => qr/(?:^|\.)nodeseek\.com$/i,
    v2ex => qr/(?:^|\.)v2ex\.com$/i,
  );
  my %seen; my @hosts;
  while ($raw =~ m{https?://([^/\s"'<>]+)}ig) {
    my $h=lc($1); $h =~ s/:\d+$//; $h =~ s/^www\.//;
    next if $h eq '' || $h =~ /^(?:localhost|127\.0\.0\.1)$/;
    next if exists $skip{$src} && $h =~ $skip{$src};
    next if $h =~ /(?:googleusercontent|gstatic|gravatar|imgur|redd\.it)$/i;
    next if $seen{$h}++;
    push @hosts,$h;
    last if @hosts >= 6;
  }
  return @hosts ? join(',',@hosts) : '-';
}
my @blocks = ($xml =~ /(<entry\b.*?<\/entry>)/gis);
@blocks = ($xml =~ /(<item\b.*?<\/item>)/gis) unless @blocks;
for my $b (@blocks) {
  my ($title)=$b =~ /<title[^>]*>(.*?)<\/title>/is; $title=clean($title);
  my ($link)=$b =~ /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/is;
  ($link)=$b =~ /<link[^>]*>(.*?)<\/link>/is unless $link; $link=clean($link);
  my ($desc_raw)=$b =~ /<(?:content|description|summary)\b[^>]*>(.*?)<\/(?:content|description|summary)>/is;
  $desc_raw //= '';
  my $desc=clean($desc_raw);
  my ($pub)=$b =~ /<(?:published|updated|pubDate)\b[^>]*>(.*?)<\/(?:published|updated|pubDate)>/is; $pub=clean($pub);
  my ($posts)=$b =~ /<discourse:posts_count>(\d+)<\/discourse:posts_count>/is; $posts //= '';
  my $text=lc("$title $desc");
  my $voxi_app_target = $text =~ /\bvoxi\b/i && $text =~ /(chatgpt|openai|\bgpt(?:-?\d+)?\b|codex|telegram|\btg\b|whatsapp|whats app|\botp\b|verif(?:y|ication)|\bsms\b|text message|验证码|验证|接码|短信|电报)/i;
  next unless $voxi_app_target || $text =~ /(\besim\b|\bsim(?: card)?\b|phone number|mobile number|\bsms\b|text message|\botp\b|verif(?:y|ication)|roaming|wi-?fi calling|activat(?:e|ion)|inactiv|expir|top[- ]?up|recharge|keep.{0,20}active|passport|\bkyc\b|reseller|seller|merchant|流量卡|手机卡|手机号|手机号码|电话卡|短信|验证码|漫游|保号|停机|销号|激活|护照|实名|充值|接码|卡商|商家|卖家)/i;
  my @c;
  push @c,'voxi-app-evidence' if $voxi_app_target;
  push @c,'retention' if $text =~ /(keep.{0,20}active|inactiv|expir|top[- ]?up|recharge|保号|停机|销号|充值)/i;
  push @c,'verification' if $text =~ /(\botp\b|verif(?:y|ication)|\bsms\b|text message|验证码|短信|接码)/i;
  push @c,'activation' if $text =~ /(activat(?:e|ion)|passport|\bkyc\b|激活|护照|实名)/i;
  push @c,'roaming' if $text =~ /(roaming|wi-?fi calling|overseas|abroad|漫游|海外|境外)/i;
  push @c,'purchase' if $text =~ /(buy|purchase|recommend|best|cheap|price|plan|provider|reseller|seller|merchant|购买|推荐|便宜|价格|套餐|运营商|哪里买|卡商|商家|卖家|店铺)/i;
  push @c,'esim' if $text =~ /\besim\b/i;
  @c=('other') unless @c;
  my @services;
  push @services,'openai' if $text =~ /(chatgpt|openai|\bgpt(?:-?\d+)?\b|codex)/i;
  push @services,'claude' if $text =~ /\bclaude\b/i;
  push @services,'telegram' if $text =~ /(telegram|\btg\b|电报)/i;
  push @services,'whatsapp' if $text =~ /(whatsapp|whats app)/i;
  push @services,'tiktok' if $text =~ /(tiktok|tik tok|抖音国际)/i;
  push @services,'google' if $text =~ /(google|gmail)/i;
  push @services,'reddit' if $text =~ /\breddit\b/i;
  push @services,'discord' if $text =~ /\bdiscord\b/i;
  my @commerce;
  push @commerce,'marketplace' if $text =~ /(marketplace|闲鱼|小黄鱼|淘宝|拼多多|\bpdd\b|ebay)/i;
  push @commerce,'reseller' if $text =~ /(reseller|seller|merchant|dealer|shop|卡商|商家|卖家|店铺|代购|转卖)/i;
  push @commerce,'deal' if $text =~ /(coupon|discount|promo(?:tion)?|referral|优惠|折扣|优惠券|返利|活动价|特价)/i;
  push @commerce,'delivery-risk' if $text =~ /(not deliver|never received|no delivery|未发货|不发货|没发|不给号|收不到卡)/i;
  push @commerce,'refund-risk' if $text =~ /(refund|退款|拒退|退不了)/i;
  push @commerce,'seller-trust' if $text =~ /(scam|跑路|骗子|黑店)/i;
  push @commerce,'restricted-marketplace-mention' if $text =~ /(暗号|小黄鱼)/i;
  my $intent='experience';
  $intent='question' if $title =~ /\?|？|\b(?:how|can i|which|what|where|anyone)\b|请问|怎么|如何|有没有|吗/i;
  $intent='complaint' if $text =~ /(avoid|failed|failure|refund|not work|problem|issue|scam|坑|失败|退款|不能用|不好用|未发货|不发货|跑路)/i;
  $intent='recommendation' if $text =~ /(recommend|best|推荐|好用)/i && $intent ne 'complaint';
  my $activity=$posts ne '' ? $posts : '-';
  my $hosts=mentioned_hosts($desc_raw,$source);
  $desc=trim_utf8_bytes($desc,420);
  my $services=@services ? join(',',@services) : '-';
  my $commerce=@commerce ? join(',',@commerce) : '-';
  for($title,$link,$pub,$desc,$services,$commerce,$hosts){s/[\t\r\n]+/ /g;}
  print join("\t",$source,join(',',@c),$intent,$activity,$pub,$title,$link,$desc,$services,$commerce,$hosts),"\n";
}
