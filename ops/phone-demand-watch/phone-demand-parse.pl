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
my @blocks = ($xml =~ /(<entry\b.*?<\/entry>)/gis);
@blocks = ($xml =~ /(<item\b.*?<\/item>)/gis) unless @blocks;
for my $b (@blocks) {
  my ($title)=$b =~ /<title[^>]*>(.*?)<\/title>/is; $title=clean($title);
  my ($link)=$b =~ /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/is;
  ($link)=$b =~ /<link[^>]*>(.*?)<\/link>/is unless $link; $link=clean($link);
  my ($desc)=$b =~ /<(?:content|description|summary)\b[^>]*>(.*?)<\/(?:content|description|summary)>/is; $desc=clean($desc);
  my ($pub)=$b =~ /<(?:published|updated|pubDate)\b[^>]*>(.*?)<\/(?:published|updated|pubDate)>/is; $pub=clean($pub);
  my ($posts)=$b =~ /<discourse:posts_count>(\d+)<\/discourse:posts_count>/is; $posts //= '';
  my $text=lc("$title $desc");
  next unless $text =~ /(\besim\b|\bsim(?: card)?\b|phone number|mobile number|\bsms\b|text message|\botp\b|verif(?:y|ication)|roaming|wi-?fi calling|activat(?:e|ion)|inactiv|expir|top[- ]?up|recharge|keep.{0,20}active|passport|\bkyc\b|流量卡|手机卡|手机号|电话卡|短信|验证码|漫游|保号|停机|销号|激活|护照|实名|充值|接码)/i;
  my @c;
  push @c,'retention' if $text =~ /(keep.{0,20}active|inactiv|expir|top[- ]?up|recharge|保号|停机|销号|充值)/i;
  push @c,'verification' if $text =~ /(\botp\b|verif(?:y|ication)|\bsms\b|text message|验证码|短信|接码)/i;
  push @c,'activation' if $text =~ /(activat(?:e|ion)|passport|\bkyc\b|激活|护照|实名)/i;
  push @c,'roaming' if $text =~ /(roaming|wi-?fi calling|overseas|abroad|漫游|海外|境外)/i;
  push @c,'purchase' if $text =~ /(buy|purchase|recommend|best|cheap|price|plan|provider|购买|推荐|便宜|价格|套餐|运营商|哪里买)/i;
  push @c,'esim' if $text =~ /\besim\b/i;
  @c=('other') unless @c;
  my $intent='experience';
  $intent='question' if $title =~ /\?|？|\b(?:how|can i|which|what|where|anyone)\b|请问|怎么|如何|有没有|吗/i;
  $intent='complaint' if $text =~ /(avoid|failed|failure|refund|not work|problem|issue|scam|坑|失败|退款|不能用|不好用)/i;
  $intent='recommendation' if $text =~ /(recommend|best|推荐|好用)/i && $intent ne 'complaint';
  my $activity=$posts ne '' ? $posts : '-';
  $desc=trim_utf8_bytes($desc,420);
  for($title,$link,$pub,$desc){s/[\t\r\n]+/ /g;}
  print join("\t",$source,join(',',@c),$intent,$activity,$pub,$title,$link,$desc),"\n";
}
