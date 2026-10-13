# Phone Radar identity/passport requirements coverage audit — 2026-10-11

**STAGED LOCAL DATA ONLY, NOT LIVE, NOT A LEGAL OR PURCHASE ELIGIBILITY CERTIFICATION.** Parent #486, then local one-release QA batch. See issue #487. User requests specific documents vs. no ID: there is no justified universal no-KYC label. Values below describe the **current route-specific evidence** rather than independently verified legal status for every one of 160 products.

## Mutually exclusive identity/document statuses (160 total)

- `required`: **68**
- `no-photo-id-reported`: **5**
- `unverified`: **76**
- `unknown`: **11**

## Passport path scope (independent dimension; not an extra 160 routes)

- `documented-for-described-flow`: **32**
- `mentioned-only`: **43**
- `not-established`: **85**

**Definitions:** `required` means reviewed text explicitly describes an identity-registration/check; exact national eligibility can still be unresolved. `no-photo-id-reported` means one particular prepaid path is reported to omit an ID-photo check, **not** that all account/purchase/recovery paths are anonymous or KYC-free. `unverified` means reviewed materials did not settle a new-line document requirement, including items about credit checks and different operations. `unknown` means no directly qualifying current route KYC record or negative disclaimer. `documented-for-described-flow` means the reviewed specific operation mentions an accepted passport; it does not prove an arbitrary Chinese/foreign passport works online abroad. `mentioned-only` means passport was referenced without proved applicability to NEW number registration. `not-established` must never be advertised as passport prohibited or no ID needed.

## Important primary-source checks and exceptions

- **Sunrise Switzerland:** [Sunrise prepaid](https://www.sunrise.ch/en/mobile/prepaid) says a valid ID or passport is required for registration; [Sunrise digital identification](https://www.sunrise.ch/en/support/contracts-and-customer-information/passwords-and-logins/digital-identification) details ID/passport/residence permit and a short video. A foreign address does **not** waive verification. Earlier keyword classifier incorrectly called it no-KYC.
- **HK ClubSIM, CMHK MySIM and csl:** [Hong Kong OFCA](https://www.ofca.gov.hk/en/consumer_focus/guide/hot_topics/sim_registration/faq/index.html) requires real-name registration for prepaid SIMs before activation; HKID holders normally use HKID, a customer without HKID may use another permitted valid travel document/passport, with exclusions for HKSAR/BN(O) passports. A pre-registered SIM from another person is not a legal alternative. Provider-specific foreign passport/onboarding acceptance still needs checking.
- **Slovenia Telemach Free2Go:** [provider Free2Go RLAH registration](https://telemach.si/pomoc/mobilna-telefonija/registracija-free2go) imposes residence or stable-ties proof for EU/EEA domestic-rate roaming benefit. That does **not** prove unconditional ID requirements or exemption for initial SIM purchase. Former false no-KYC label has been replaced by unverified.
- **Israel HOT Mobile and Canada 7-Eleven SpeakOut:** older no-KYC claims are withdrawn/unproven; no credit check is not a SIM identity exemption. Both are unverified until a matching original activation/ID evidence source is obtained.
- **Vodafone Netherlands:** prepaid product and top-up pages do not settle universal new-SIM identity checks; lack of a line mentioning KYC is not a legal no-ID finding.
- **EE UK / Tello US / Ultra PayGo / H2O / Lyca UK:** narrowly worded prepaid no-photo-ID-check reports, not proven anonymous registration, first activation abroad, accepted payment or future replacement.
- **O2 Czech:** passport/ID in replacement-SIM process and generic country anonymous prepaid comments are not proof of passport or no passport needed for a new O2 prepaid line.
- **Kyivstar Ukraine:** connection without a passport does not rule out other forms of registration or national ID.
- **Singtel Singapore tourist and StarHub:** short-stay passport route may last only 30 days and continuing registration requires a Singapore-issued eligible ID/work pass; not a long-term roaming-number win.

## Audit all 160 normalized route records

These provider links are **related references already associated with the route**, not a guarantee that that specific URL proves the document assertion. User-visible details show the untruncated current source KYC notes, method/eligibility warning and all available linked sources. Additional passport-country, payment and remote activation corroboration requires source-by-source review.

| Route | Market | Current ID evidence | Passport scope | Other document cues (mentions only) | Related source reference |
| --- | --- | --- | --- | --- | --- |
| `1pmobile-uk-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.1pmobile.com/tacs) |
| `2degrees-prepay-2026` | New Zealand | unverified | not-established | not documented | [Source](https://www.2degrees.nz/help/account-and-billing/billing-and-payment/prepay-balance-and-payments) |
| `5sim-temp` | Global / multi-market | unverified | not-established | not documented | [Source](https://5sim.net/docs) |
| `a1-bfree-at-2026` | Austria | required | not-established | national-or-local-ID | [Source](https://www.a1.net/handys-tarife/wertkartentarife) |
| `a1-croatia-prepaid-esim` | Croatia | unknown | not-established | not documented | [Source](https://www.a1.hr/privatni/inozemstvo/cjenik-bonovi) |
| `a1-hr-prepaid-2026` | Croatia | unverified | documented-for-described-flow | passport | [Source](https://www.a1.hr/privatni/mobiteli/a1-na-bonove/pristupnica) |
| `activatex-temp` | Global / multi-market | unknown | not-established | not documented | Not independently linked |
| `ahamo-jp-2026` | Japan | required | not-established | residence-permit-or-local-status | [Source](https://ahamo.com/support/procedure/other/requirements/index.html) |
| `ais-local-prepaid-th-2026` | Thailand | unverified | mentioned-only | passport | [Source](https://www.ais.th/en/consumers/package/exclusive-plan/esim/esim-change) |
| `ais-sim2fly-365d-2026` | Thailand | required | documented-for-described-flow | passport | [Source](https://www.ais.th/en/consumers/help-and-support/network-technologies/update-sim-registration) |
| `aldi-talk-activity-window-2026` | Germany | required | not-established | biometric-or-face-check | [Source](https://media.medion.com/cms/medion/alditalkde/ALDI-TALK-Aktivitaetszeitfenster-der-SIM-Karte.pdf?v=0426) |
| `asda-mobile-uk-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://mobile.asda.com/support/topping-up) |
| `bakcell-cin-az-2026` | Azerbaijan | unverified | not-established | not documented | [Source](https://bakcell.com/en/active-period-of-the-number-based-on-the-tariffs) |
| `beeline-kz-simka-v-seyfe-2026` | Kazakhstan | unverified | documented-for-described-flow | passport | [Source](https://beeline.kz/ru/ctn-registration) |
| `beeline-uz-2026` | Uzbekistan | required | mentioned-only | passport | [Source](https://beeline.uz/en/products/services/esim) |
| `bhtelecom-ba-2026` | Bosnia and Herzegovina | unverified | documented-for-described-flow | passport | [Source](https://mojwebshop.bhtelecom.ba/INTERSHOP/web/BOS/BHTelecomWebShop-BHTelecom-Site/bs_BA/-/BAM/ViewProduct-Start?SKU=908992) |
| `btc-bs-2026` | Bahamas | unverified | not-established | not documented | [Source](https://www.btcbahamas.com/business/enterprise/mobile-integrated-solutions) |
| `calendar-rakuten-prepaid-jp-2026` | Japan | unverified | not-established | not documented | [Source](https://www.jpsimshop.com/view/item/000000000110?category_page_id=ct19) |
| `cellcard-kh-2026` | Cambodia | required | mentioned-only | passport | [Source](https://www.cellcard.com.kh/en/news/cellcard-launches-on-cambodia-e-arrival-app) |
| `cellfie-ge-90-45d-2026` | Georgia | unverified | mentioned-only | passport | [Source](https://cellfie.ge/en/esim) |
| `china-telecom-macau-easy-pass-2026` | Macau | required | not-established | not documented | [Source](https://www.1888.com.mo/help/detail?tabCode=DXYW04) |
| `cht-ruyi-180d-2026` | Taiwan | unverified | not-established | not documented | [Source](https://www.cht.com.tw/home/campaign/prepaidcard/applynew) |
| `claro-pre-ar-2026` | Argentina | required | documented-for-described-flow | passport | [Source](https://simple.claro.com.ar/esimple/) |
| `claro-pre-br-90d-2026` | Brazil | required | documented-for-described-flow | passport | [Source](https://www.claro.com.br/celular/planos-pre) |
| `claro-pre-cl-2026` | Chile | required | mentioned-only | passport | [Source](https://www.clarochile.cl/personas/servicios/servicios-moviles/prepago/?tab=plansimple) |
| `claro-pre-co-2026` | Colombia | unverified | mentioned-only | passport | [Source](https://www.claro.com.co/personas/servicios/servicios-moviles/prepago/) |
| `clubsim-sms-pack-6hkd-2026` | Hong Kong | required | documented-for-described-flow | passport | [Source](https://clubsim.com.hk/en/go/clubSim-tnc) |
| `cmhk-mysim-hk-2026` | Hong Kong | required | documented-for-described-flow | passport, national-or-local-ID | [Source](https://www.hk.chinamobile.com/en/home/prepaid-card/prepaid-services) |
| `cmlink-uk-keep-number-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.cmlink.com/uk/en/) |
| `cosmote-frog-13mo-2026` | Greece | required | not-established | not documented | [Source](https://www.frogmobile.gr/en/content/general-terms-prepaid) |
| `cricket-us-2026` | United States | unverified | not-established | not documented | [Source](https://www.cricketwireless.com/manageautopay) |
| `csl-711-prepaid-hk-2026` | Hong Kong | required | documented-for-described-flow | passport | [Source](https://www.hkcsl.com/en/7_eleven_prepaid_sim) |
| `ctexcel-uk-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.ctexcel.com/uk/trail/index/1?lang=en&recommendCode=IQ) |
| `cyta-soeasy-cy-2026` | Cyprus | required | documented-for-described-flow | passport | [Source](https://www.cyta.com.cy/faq-soeasy/en) |
| `dialog-lk-365d-2026` | Sri Lanka | required | documented-for-described-flow | passport | [Source](https://dialog.lk/number-recycling-process) |
| `digi-reload-validity-my-2026` | Malaysia | required | documented-for-described-flow | passport, national-or-local-ID, biometric-or-face-check, visa-or-stay-conditions | [Source](https://help.celcomdigi.com/en/support/solutions/articles/70000660369-what-is-my-reload-validity-) |
| `digicel-jm-2026` | Jamaica | unverified | documented-for-described-flow | passport | [Source](https://topup.digicelgroup.com/en/faq/mobile-recharge/) |
| `dito-prepaid-ph-2026` | Philippines | required | documented-for-described-flow | passport, visa-or-stay-conditions, address-proof | [Source](https://dito.ph/prepaid) |
| `du-prepaid-ae-2026` | UAE | unverified | not-established | residence-permit-or-local-status, visa-or-stay-conditions | [Source](https://www.du.ae/support-articledetail?artid=PROD-89276&lang=en-GB&userType=business&version=2.0) |
| `ee-uk-payg-180d-2026` | United Kingdom | no-photo-id-reported | not-established | not documented | [Source](https://ee.co.uk/mobile/free-sim) |
| `elisa-prepaid-fi-2026` | Finland | required | not-established | not documented | [Source](https://elisa.fi/asiakaspalvelu/english/prepaid-instructions/) |
| `esimgg-estonia-372-2026` | Estonia | unknown | not-established | not documented | [Source](https://esim.gg/support/faq) |
| `etisalat-wasel-ae-2026` | UAE | required | mentioned-only | passport, residence-permit-or-local-status, visa-or-stay-conditions | [Source](https://www.eand.ae/en/c/support/mobile/prepaid/wasel-prepaid-line/overview-and-benefits.html) |
| `fareastone-prepaid-tw-2026` | Taiwan | unverified | mentioned-only | passport, residence-permit-or-local-status | [Source](https://service.fetnet.net/prepaid/product/prepaid-card.html) |
| `fortress-hahasim-hk-2026` | Hong Kong | required | not-established | national-or-local-ID | [Source](https://www.fortress.com.hk/en/services/services?category=Order) |
| `free-mobile-fr-2026` | France | unverified | not-established | not documented | [Source](https://mobile.free.fr/fiche-forfait-2-euros) |
| `giffgaff-uk-direct-esim-payg` | United Kingdom | unverified | not-established | not documented | [Source](https://help.giffgaff.com/en/articles/240403-what-to-do-if-you-delete-your-esim) |
| `globe-prepaid-1yr-2026` | Philippines | required | documented-for-described-flow | passport, visa-or-stay-conditions, address-proof | [Source](https://www.globe.com.ph/prepaid/local-esim-terms) |
| `go-payasyougo-mt-2026` | Malta | required | mentioned-only | passport | [Source](https://www.go.com.mt/terms-and-conditions/auto-topup-and-sms-topup/) |
| `good2go-payg-ca-2026` | Canada | unverified | not-established | not documented | [Source](https://good2gomobile.ca/) |
| `google-fi-flexible-2026` | United States | unverified | not-established | not documented | [Source](https://support.google.com/fi/answer/6157794?hl=en) |
| `grameenphone-validity-pack-2026` | Bangladesh | required | mentioned-only | passport, national-or-local-ID, biometric-or-face-check | [Source](https://www.grameenphone.com/bn/personal/plans-offers/offers/account-validity-extender) |
| `h2o-paygo-10-90d-2026` | United States | no-photo-id-reported | not-established | not documented | [Source](https://www.h2owireless.com/plan/minute) |
| `h2o-paygo-us` | United States | unknown | not-established | not documented | [Source](https://www.h2owireless.com/terms-conditions) |
| `hkmobi-365-hk-2026` | Hong Kong | required | not-established | not documented | [Source](https://www.hkcsl.com/en/dealer-prepaid-sim/) |
| `hotlink-pantas-365-pass-2026` | Malaysia | required | documented-for-described-flow | passport, national-or-local-ID, biometric-or-face-check | [Source](https://www.hotlink.com.my/en/faq/products/prepaid-pantas/passes/) |
| `hotmobile-il-2026` | Israel | unverified | not-established | not documented | [Source](https://www.hotmobile.co.il/Hotalk/Pages/cards.aspx) |
| `id-mobile-uk-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.idmobile.co.uk/sim-only-deals/pay-as-you-go) |
| `ifmobile-jp-2026` | Japan | unverified | mentioned-only | passport, biometric-or-face-check | [Source](https://ifmobile.jp/download/ekyc_notice.pdf) |
| `iijmio-jp-2026` | Japan | required | not-established | not documented | [Source](https://help.iijmio.jp/answer/6114939f2b2265001db02e41/) |
| `jazz-pk-2026` | Pakistan | unverified | documented-for-described-flow | passport, biometric-or-face-check, visa-or-stay-conditions | [Source](https://jazz.com.pk/prepaid/international-roaming-tariff) |
| `jio-prepaid-90d-trai-2026` | India | unverified | documented-for-described-flow | passport, national-or-local-ID, biometric-or-face-check, address-proof | [Source](https://www.jio.com/help/faq/mobile/prepaid-offerings/plans/what-documents-do-i-need-to-carry-to-get-a-jio-sim-for-jio-prepaid-plans/) |
| `kolbi-cr-2026` | Costa Rica | unverified | mentioned-only | passport | [Source](https://www.kolbi.cr/wps/portal/kolbi/personas/mas-servicios/servicios-adicionales/e-sim-kolbi) |
| `kpn-prepaid-6mo-2026` | Netherlands | unverified | not-established | not documented | [Source](https://www.kpn.com/shop/mobiel/prepaid) |
| `kt-prepaid-kr-2026` | South Korea | required | documented-for-described-flow | passport | [Source](https://globalshop.kt.com/mobile/mobileLteWelcomePrepaid.do) |
| `kyivstar-prepaid-274-91-2026` | Ukraine | unverified | mentioned-only | passport | [Source](https://kyivstar.ua/additional-prepaid) |
| `labas-90-120d-2026` | Lithuania | required | documented-for-described-flow | passport, residence-permit-or-local-status, biometric-or-face-check | [Source](https://www.labas.lt/en/help) |
| `lebara-fr-2026` | France | unverified | not-established | not documented | [Source](https://www.lebara.fr/content/dam/lebara/markets/fr/legal-files/terms-and-conditions/clients-existants/sfr/december24/Recapitulatif%20contractuel%20Forfait%20mensuel%20Lebara%20clients%20existants%202H%20201224.pdf) |
| `lebara-uk-direct-esim-china` | United Kingdom | unverified | not-established | not documented | [Source](https://www.lebara.co.uk/en/help/new-members/my-sim-card-not-working.html) |
| `lguplus-prepaid-kr-2026` | South Korea | unverified | mentioned-only | passport | [Source](https://www.lguplus.com/korea-sim/eng/pc/product/simcard?tab=data-voice) |
| `linemo-jp-2026` | Japan | required | documented-for-described-flow | passport, residence-permit-or-local-status | [Source](https://www.linemo.jp/plan/index.html) |
| `lmt-karte-60-60d-2026` | Latvia | unverified | not-established | not documented | [Source](https://www.lmt.lv/en/lmt-karte/new-number) |
| `luckysim-hk-prepaid-2026` | Hong Kong | required | not-established | not documented | [Source](https://shop.luckysim.com.hk/luckysim-3years-hk-data-30gb-voice-2000mins) |
| `lycamobile-uk-keep-number-2026` | United Kingdom | no-photo-id-reported | not-established | not documented | [Source](https://www.lycamobile.co.uk/) |
| `lycamobile-us-2026` | United States | unverified | not-established | not documented | [Source](https://www.lycamobile.us/blog/en/world-cup-2026-esim-guide-host-cities/) |
| `magticom-number-maintenance-2026` | Georgia | unverified | documented-for-described-flow | passport, national-or-local-ID | [Source](https://www.magticom.ge/en/mobile/mobile-services/esim-service) |
| `maroc-telecom-prepaid-2026` | Morocco | unverified | mentioned-only | passport | [Source](https://www.iam.ma/ar/conditions-g%C3%A9n%C3%A9rales-de-vente-%C3%A0-distance-e-boutique-d-abonnement-t%C3%A9l%C3%A9phonie-mobile-pr%C3%A9pay%C3%A9-jawal) |
| `mint-mobile-us-2026` | United States | unverified | not-established | not documented | [Source](https://www.mintmobile.com/phone-plans/12-month-plans/?selected=MINT-SMALL-12) |
| `mobal-japan-data-physical` | Japan | unknown | not-established | not documented | [Source](https://www.mobal.com/japan-sim-card/) |
| `mobal-japan-voice-2026` | Japan | required | documented-for-described-flow | passport | [Source](https://helpdesk.mobal.com/support/solutions/articles/205000051089-i-d-requirements-voice-products-) |
| `mobal-japan-voice-data` | Japan | unknown | not-established | not documented | [Source](https://helpdesk.mobal.com/support/solutions/articles/205000042589-phone-number-type) |
| `mobitel-lk-retention-2026` | Sri Lanka | unverified | mentioned-only | passport | [Source](https://www.mobitel.lk/node/110) |
| `movistar-pre-pe-2026` | Peru | required | not-established | biometric-or-face-check | [Source](https://www.movistar.com.pe/movil/esim) |
| `movistar-prepago-6mo-2026` | Spain | required | documented-for-described-flow | passport | [Source](https://prod.adb.col.movistar.es/content/dam/movistar/contratos/cp-servicio-recarga-tarjetas.pdf) |
| `mtn-gh-prepaid-2026` | Ghana | required | mentioned-only | passport, biometric-or-face-check | [Source](https://help-center.mtn.com.gh/hc/en-us/articles/4415994376466-How-to-Reserve-Your-MTN-Number-Number-for-Life) |
| `mtn-ng-keepmynumber-2026` | Nigeria | required | mentioned-only | passport, visa-or-stay-conditions | [Source](https://www.mtn.ng/sim/keep-my-number/) |
| `mts-by-2026` | Belarus | unverified | not-established | not documented | [Source](https://www.mts.by/services/mobile/tariffs/for_guest/gostevoi/) |
| `mts-sokhranyayu-nomer-2026` | Russia | required | mentioned-only | passport | [Source](https://mts.ru/personal/mobilnaya-svyaz/uslugi/mobilnaya-svyaz/sohranyayu-nomer) |
| `ncell-np-2026` | Nepal | required | documented-for-described-flow | passport | [Source](https://www.business.ncell.com.np/en/individual/roaming/28-day-china-combo-pack) |
| `o2-cz-prepaid-2026` | Czech Republic | unverified | mentioned-only | passport | [Source](https://www.o2.cz/osobni/volani/predplacena-karta) |
| `o2-uk-classic-payg-6mo-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.o2.co.uk/termsandconditions/mobile/pay-as-you-go-classic-tariff-standard-rates) |
| `omantel-om-2026` | Oman | unverified | mentioned-only | passport, residence-permit-or-local-status | [Source](https://webportal.omantel.om/about-us/regulatory/standard-customer-agreement) |
| `one-me-2026` | Montenegro | required | mentioned-only | passport, national-or-local-ID | [Source](https://1.me/cg/o-kompaniji/terms-and-conditions/customer-data-privacy/how-we-process-personal-data) |
| `one-nz-prepay-2026` | New Zealand | unverified | mentioned-only | passport | [Source](https://one.nz/legal/terms-conditions/mobile/) |
| `ooredoo-hala-qa-2026` | Qatar | unverified | mentioned-only | passport | [Source](https://www.ooredoo.qa/web/en/prepaid-plans/buy-prepaid-sim/) |
| `optus-flex-plus-au-2026` | Australia | required | not-established | not documented | [Source](https://www.optus.com.au/prepaid/activate) |
| `orange-mobicarte-2026` | France | required | not-established | not documented | [Source](https://boutique.orange.fr/vitrine/offres-prepayees/) |
| `orange-pl-nakarte-2026` | Poland | required | mentioned-only | passport | [Source](https://www.orange.pl/view/utrzymanie-numeru) |
| `orange-prepay-ro-ladder-2026` | Romania | unverified | not-established | not documented | [Source](https://www.orange.ro/help/perioada-de-activitate-si-de-gratie-47) |
| `orange-sn-sama-numero-2026` | Senegal | unverified | not-established | not documented | [Source](https://www.orange.sn/actualite/sama-numero) |
| `povo20-zero-base-2026` | Japan | required | not-established | residence-permit-or-local-status | [Source](https://faq.povo.jp/faq/show/858?site_domain=default) |
| `proximus-paygo-be-2026` | Belgium | required | documented-for-described-flow | passport | [Source](https://www.proximus.be/en/id_cr_dkyc_faqs/personal/mobile/mobile-subscriptions/identification-order-faq.html) |
| `rakuten-mobile-jp-2026` | Japan | required | mentioned-only | passport, residence-permit-or-local-status | [Source](https://network.mobile.rakuten.co.jp/guide/verify/nfc-kyc/) |
| `redpocket-annual-2026` | United States | unverified | not-established | not documented | [Source](https://www.redpocket.com/plans/annual) |
| `safaricom-daima-2026` | Kenya | required | mentioned-only | passport, national-or-local-ID | [Source](https://www.safaricom.co.ke/media-center-landing/frequently-asked-questions/daima-service) |
| `saily-us-phone-number-2026` | United States | required | not-established | not documented | [Source](https://support.saily.com/hc/en-us/articles/27948689277596-Can-I-use-Saily-phone-number-for-OTP-and-2FA) |
| `sakura-japan-voice-data` | Japan | unknown | not-established | not documented | [Source](https://support.sakuramobile.jp/hc/en-us/articles/27171487316121--Travel-SIM-eSIM-Can-I-make-phone-calls-or-send-SMS-with-the-Travel-SIM-eSIM) |
| `singtel-hi-prepaid-passport-30d-2026` | Singapore | required | documented-for-described-flow | passport, residence-permit-or-local-status | [Source](https://www.singtel.com/content/dam/singtel/personal/products-services/mobile/prepaid-plans/Terms%20%26%20Conditions/03_FAQ_20241104.pdf) |
| `skinny-prepay-12mo-2026` | New Zealand | unverified | not-established | not documented | [Source](https://www.skinny.co.nz/mobileappskinny-terms/) |
| `skt-prepaid-kr-2026` | South Korea | required | documented-for-described-flow | passport | [Source](https://www.tworld.co.kr/poc/eng/html/EN1.2T.html) |
| `smart-prepaid-ph-2026` | Philippines | required | not-established | visa-or-stay-conditions | [Source](https://smart.com.ph/Pages/esim) |
| `smarty-uk-2026` | United Kingdom | unverified | mentioned-only | passport | [Source](https://smarty.co.uk/all-plans) |
| `smspool-temp` | Global / multi-market | unknown | not-established | not documented | Not independently linked |
| `sosim-recharge-ladder-2026` | Hong Kong | required | not-established | not documented | [Source](https://www.sosimhk.com/en/faq.html) |
| `speakout-711-365voucher-2026` | Canada | unverified | not-established | not documented | [Source](https://speakout7eleven.ca/pages/help) |
| `starhub-prepaid-sg-2026` | Singapore | required | documented-for-described-flow | passport | [Source](https://www.starhub.com/personal/support/article/AVnmWLEB0l4ykV4rkdrnj6.html) |
| `stc-sawa-sa-2026` | Saudi Arabia | unverified | not-established | not documented | [Source](https://www.stc.com.sa/en/content-page/termsandconditions.html) |
| `sunrise-prepaid-2026` | Switzerland | required | documented-for-described-flow | passport | [Source](https://www.sunrise.ch/en/mobile/prepaid) |
| `taiwan-mobile-prepaid-tw-2026` | Taiwan | required | mentioned-only | passport, residence-permit-or-local-status | [Source](https://www.taiwanmobile.com/mobile/prepaid/5Gprepaid.html) |
| `talkmobile-uk-payg-closed-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://talkmobile.co.uk/sim-only) |
| `telcel-amigo-lifecycle-2026` | Mexico | required | documented-for-described-flow | passport, residence-permit-or-local-status | [Source](https://www.telcel.com/personas/politicas-y-codigos/contrato-prestacion-servicios) |
| `telekom-easy-sk-90d-2026` | Slovakia | unverified | not-established | not documented | [Source](https://www.telekom.sk/wiki/volania/vyska-a-platnost-kreditu) |
| `telemach-prepaid-si-2026` | Slovenia | unverified | mentioned-only | passport | [Source](https://telemach.si/mobilna/predplacniski-paketi/mobilni-paket-free2-go) |
| `telenor-kontant-no-2026` | Norway | unverified | mentioned-only | passport | [Source](https://www.telenor.no/telenor-id/) |
| `telenor-kontantkort-se-2026` | Sweden | required | not-established | not documented | [Source](https://www.telenor.se/mobilabonnemang/) |
| `telia-dk-prepaid-2026` | Denmark | unverified | not-established | not documented | [Source](https://norlys.dk/login/) |
| `telia-ee-180d-2026` | Estonia | unverified | not-established | not documented | [Source](https://www.super.ee/en/stardikas) |
| `telkomsel-simpati-365d-2026` | Indonesia | unverified | mentioned-only | passport | [Source](https://www.telkomsel.com/en/vas/perpanjangan-masa-aktif) |
| `tello-paygo-credit-2026` | United States | no-photo-id-reported | not-established | not documented | [Source](https://tello.com/help_center/activate-port-in/can-i-activate-tello-while-i-m-abroad) |
| `tello-us` | United States | unknown | not-established | not documented | [Source](https://tello.com/help_center/service-issues-troubleshooting/how-can-i-use-wi-fi-calling) |
| `telstra-prepaid-longexpiry-2026` | Australia | required | documented-for-described-flow | passport | [Source](https://www.telstra.com.au/mobile-phones/prepaid-mobiles) |
| `tesco-mobile-payg-uk-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.tescomobile.com/content/dam/tesco-mobile/terms-and-conditions/pay-as-you-go/Pay%20as%20you%20go%20essentials%20terms%20and%20conditions%20July%202025.pdf) |
| `three-ie-prepay-lifecycle-2026` | Ireland | required | not-established | not documented | [Source](https://www.three.ie/legal/terms/prepay.html) |
| `three-uk-payg-180d-2026` | United Kingdom | unverified | not-established | not documented | [Source](https://www.three.co.uk/content/dam/threedigital/terms-and-conditions/price-guides/latest-price-guides/newpaygplans-priceguide-19042026.pdf) |
| `threehk-diy-recharge-2026` | Hong Kong | required | mentioned-only | passport | [Source](https://web.three.com.hk/epop/SalesKit-DIYprepaidSIMsalesKit20240430.pdf) |
| `tigo-tz-2026` | Tanzania | unverified | not-established | not documented | [Source](https://tcra.go.tz/laws-and-guidelines/guidelines/guidelines-and-procedures-for-sim-card-registrations-for-visitors) |
| `tim-prepaid-12mo-2026` | Italy | unverified | mentioned-only | passport | [Source](https://www.tim.it/assistenza/per-la-tua-linea/riattivare-una-sim) |
| `tmobile-prepaid-connect-2026` | United States | unverified | not-established | not documented | [Source](https://prepaid.t-mobile.com/connect/phone-plans) |
| `trip-cmlink-china-data` | China | unknown | not-established | not documented | [Source](https://sg.trip.com/things-to-do/detail/71336361-mainland-china-5g-esim-internet-card-mobile-cmlink-15-days/) |
| `truemove-validity-pack-th-2026` | Thailand | required | mentioned-only | passport | [Source](https://www.true.th/) |
| `tunetalk-365-my-2026` | Malaysia | required | not-established | not documented | [Source](https://mcmc.bernama.com/news.php?id=2528106) |
| `turkcell-tourist-90d-blocker-2026` | Turkey | required | mentioned-only | passport, biometric-or-face-check | [Source](https://www.btk.gov.tr/kurul-kararlari) |
| `ultra-mobile-paygo-3-2026` | United States | no-photo-id-reported | not-established | not documented | [Source](https://www.ultramobile.com/paygo/) |
| `ultra-paygo-us` | United States | unknown | not-established | not documented | [Source](https://www.ultramobile.com/paygo/) |
| `us-mobile-light-2026` | United States | unverified | not-established | not documented | [Source](https://www.usmobile.com/get-started-bundles) |
| `viettel-vtvang-keepnumber-2026` | Vietnam | required | mentioned-only | passport, national-or-local-ID | [Source](https://www.vietteltelecom.vn/tin-tuc/chi-tiet/thong-bao-thue-bao-viettel-bi-chan-do-chua-xac-thuc-thong-tin-huong-dan-cach-xu-ly/15333972) |
| `vinaphone-giu-so-vn-2026` | Vietnam | required | not-established | not documented | [Source](https://vinaphone.com.vn/di-dong/gs2/) |
| `visible-25-2026` | United States | unverified | not-established | not documented | [Source](https://www.visible.com/plans/annual) |
| `vodacom-prepaid-83d-2026` | South Africa | unverified | not-established | not documented | [Source](https://www.vodacom.co.za/vodacom/shopping/plans/prepaid-plans) |
| `vodafone-callya-90d-2026` | Germany | required | mentioned-only | passport, biometric-or-face-check | [Source](https://www.vodafone.de/hilfe/prepaid.html) |
| `vodafone-eg-2026` | Egypt | unverified | mentioned-only | passport, visa-or-stay-conditions | [Source](https://web.vodafone.com.eg/en/other-services) |
| `vodafone-nl-prepaid-2026` | Netherlands | unverified | not-established | not documented | [Source](https://www.vodafone.nl/support/toestel-en-sim/esim) |
| `vodafone-tuti-hu-2026` | Hungary | required | mentioned-only | passport | [Source](https://www.one.hu/shop/feltoltokartyas-adategyeztetes) |
| `vodafone-uk-zero-esim-2026` | United Kingdom | unverified | not-established | not documented | Not independently linked |
| `vodafone-yorn-pt-2026` | Portugal | unverified | not-established | not documented | [Source](https://www.vodafone.pt/content/digital-yorn/pt/yorn/ajuda/aderir-yorn/como-posso-aderir-a-yorn.html) |
| `voxi-uk-esim-payg-retention` | United Kingdom | unverified | not-established | not documented | Not independently linked |
| `yettel-prepaid-bg-2026` | Bulgaria | required | mentioned-only | passport, national-or-local-ID | [Source](https://www.yettel.bg/bg/planove/predplateni-planove/predplatena-esim) |
| `yettel-rs-2026` | Serbia | required | mentioned-only | passport, national-or-local-ID | [Source](https://www.yettel.rs/sr/privatni/ponuda/tarifni-paketi/pripejd/) |
| `zain-kw-eezee-2026` | Kuwait | unverified | mentioned-only | passport | [Source](https://www.kw.zain.com/en/shop/wiyanaeezeeplans) |
| `redpocket-ebay-30-2026` | United States | unverified | not-established | not documented | [Source](https://help.redpocket.com/red-pocket-mobile-offers-annual-12-month-plans) |

## Follow-on evidence queue

1. Audit the `unverified` and `unknown` routes in descending real user-interest order; gather route/SKU-specific original buyer success/failure and current primary legal or carrier method, not just broad country rules.
2. Treat nationality, address, residency, biometric selfie, visa, local payment and in-country first activation as separate fields when exact source supports them.
3. Never infer that passport alone is sufficient when a product needs a local ID, residence permit, specific channel, 30-day tourist period or face-check.
4. Keep original KYC sentences and current snapshot/sources intact; do not convert generic no-credit-check marketing into no-KYC.
5. Frontend filter choices must be scoped to current evidence; a research-only result cannot become a purchase recommendation or guarantee of SMS for a named bank.
