---
title: Email Phishing Analysis - "Continente - Win a Nespresso Machine"
classes: wide
header:
  teaser: /assets/images/MA/EmailPhishing-Continente/phishing.png
ribbon: MidnightBlue
categories:
  - Phishing-analysis
toc: true
---

# Introduction
Same campaign, 2 different lure versions, which we will call V1 (2 different email samples):

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_1email1.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): Phishing Email V1<u></u> </font></center>
<br>

and V2 (1 email sample):

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_2-email2.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): Phishing Email V2<u></u> </font></center>
<br>

It is targeting portuguese citizens with an incredible offer - social engineering feelings being exploited:

- Trust - Continente is a well known brand in Portugal.
- Scarcity - “one of the lucky few”

A nespresso coffe machine will be gifted, if the user answers a few “quick questions”

# Technical Analysis
## Headers
Version 1 is bypassing all authentication protocols. By looking deeper, we can see that the domain of the “Envelope From” (which is the same as the “Header From’s”) was created almost one month before the emails were sent (06 and 07 May 2025) - airbodyfly.za[.]com. 

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_5whois.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): Whois<u></u> </font></center>
<br>

It used different subdomains for each email sample.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_3-returnpath.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): Phishing Email V1 - sample 1<u></u> </font></center>
<br>
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_3-returnpath.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): Phishing Email V1 - sample 2<u></u> </font></center>
<br>

## Body
### URLs
V1 sample 1:

- https://storage.googleapis[.]com/abresoumo/290425qdlkj.html#4QBMoV139760Bdcv844rgnspfycek13199XKSVFDIYWVRMZPA58137BOUY19784S35
- https://storage.googleapis[.]com/abresoumo/290425qdlkj.html#4MxtYx139760IXek844jkzghrkgrv13199AVGMOKPCDBEELKJ58137PEEZ19784N35
- https://storage.googleapis.com/abresoumo/290425qdlkj.html#4vgLwE139760EkNG844rzzxewoenl13199NRAHSSIPDKZJZJI58137WVJJ19784y35
- https://storage.googleapis.com/warebirebim3ahadl9awm/warebirebim3ahadl9awm.html#5SpUfS139760naCg844uyjoyfuged13199KNLKNYDEAXBWLAR58137STJV19784U35

V1 sample 2:

- https://storage.googleapis[.]com/abresoumo/290425qdlkj.html#4lwMAe138295mGgN844eacsfqzxki13199MGCNLUXOULPLSAY58137WOAS19784y35
- https://storage.googleapis[.]com/abresoumo/290425qdlkj.html#4AqKyB138295rNen844hxozqqsczo13199NMFUUSNTZTAMYAF58137MGUX19784M35
- https://storage.googleapis[.]com/abresoumo/290425qdlkj.html#4NsmyJ138295LuKu844toqhsjvumd13199NWYXSBZFIXQLBRZ58137SZYM19784M35
- https://storage.googleapis[.]com/3awedmnjdid001/03333fg5hfg568.html#5YgWSc138295GaCR844pdhswjiqaq13199LEATHCJDGVVQZGU58137BHCE19784K35

V2:

- https://storage.googleapis[.]com/yasouimoman/290425qdlkj.html#4tRtTE141204jwFG844xhhqaeqsxp13199FKVEHHYKSTUPFZX58137DOYB19917r35
- https://storage.googleapis[.]com/yasouimoman/290425qdlkj.html#4PLbQj141204OHLY844sgrqjnvtbi13199EXYZQUGSADSZYTX58137ASNW19917R35
- https://storage.googleapis[.]com/warebirebim3ahadl9awm/warebirebim3ahadl9awm.html#5HmPWX141204swga844witmypcblc13199GZJMOWDFXQECNXC58137QGRO19917k35

These URLs have the same purpose, pointing to a html document that holds a javascript script which, in turn, uses the fragment (#) as “tarcking_param” - a typo we’ve seen in [past analysis](https://malwarerookie.wiki/phishing-analysis/EmailPhishing-CTT/#basic-email-analysis) - to redirect users to another domain. By using storage.googleapis.com it is adding a layer of credibility, while also difficulting the task of email security solutions, given it could be used for legitimate purposes.
The “sv_ip” variable holds different values for each storage URL.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_6redirectscript.png" />
</p>
<center><font size="3"> <u>Figure</u>(6): Redirect script (https://storage.googleapis[].]com/abresoumo/290425qdlkj.html)<u></u> </font></center>
<br>
 
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_7redirectchaint.png" />
</p>
<center><font size="3"> <u>Figure</u>(7): Incomplete redirect chain in URLScan<u></u> </font></center>
<br>

As it is employing multiple redirects and cloaking through params, it was not possible to find the complete redirection chain using URLScan. 

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_7.5redirectchain.png" />
</p>
<center><font size="3"> <u>Figure</u>(8): Redirect chain on Firefox (to be continued)<u></u> </font></center>
<br>

Here we have another lure page. It is full of urgency calls to action, including a timer. URL: https://findoutifulcky.quest/?sub5=24779&source_id=20733&encoded_value=223GDT1&sub1=4831cf1866af40f897586edefdea97e7&sub2=&sub3=&sub4=&sub5=24779&source_id=20720&domain=www.loiete.com&ip=[IP_address]

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_8redirectedpaget.png" />
</p>
<center><font size="3"> <u>Figure</u>(9): First landing page<u></u> </font></center>
<br>

After filling out the form, in order to “win a Nespresso coffe machine”, it redirects the victim to sweepzprizes[.]com, where a login screen is presented, which includes a payment step, revealing the ultimate goal of the malicious campaign. The strings on a script also prove that is the case.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_10-secondredirectchain.png" />
</p>
<center><font size="3"> <u>Figure</u>(10): One more redirection chain<u></u> </font></center>
<br> 
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_11-finalpage1.png" />
</p>
<center><font size="3"> <u>Figure</u>(11): Next landing page<u></u> </font></center>
<br>
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_11.5paymentindicator.png" />
</p>
<center><font size="3"> <u>Figure</u>(12): Payment strings (https://sweepzprizes[.]com/theme/Master/SubscriptionPages/js/subscriptions/min/scripts.min.1207b526.js)<u></u> </font></center>
<br>

The redirection chain continues after the login POST request. However,  it seems to be using parklogic.com infrastructure, which requires multiple cloaking parameters (for example gpu of the victim’s machine), preventing us from going further down the rabbit hole.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_12afterloginpost.png" />
</p>
<center><font size="3"> <u>Figure</u>(13): Another redirection chain<u></u> </font></center>
<br> 
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_13gpucloaking.png" />
</p>
<center><font size="3"> <u>Figure</u>(14): Example of cloaking parameters<u></u> </font></center>
<br>  

Even after checking the URL on hybrid-analysis, it was still not possible to find anything else.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_14hybridanalysis.png" />
</p>
<center><font size="3"> <u>Figure</u>(15): Hybrid-analysis<u></u> </font></center>
<br>

yfdpco.com is flagged by multiple vendors on Virustotal. The resolving IP address (208.91.196[.]46) is also being pointed to (or was) by dozens of other suspicious domains. A high number of them have a 302 redirect header and, while it does not prove that every single one belongs to this malicious infrastrucure, it seems quite clear that this operation is much larger than what we are able to uncover in this analysis.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_15virustotal.png" />
</p>
<center><font size="3"> <u>Figure</u>(16): VirusTotal (yfdpco.com)<u></u> </font></center>
<br>
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-Continente\Screenshot_16fofa.png" />
</p>
<center><font size="3"> <u>Figure</u>(17): Fofa rule: ip="208.91.196.46" && protocol="http”<u></u> </font></center>
<br>


# Yara Rule
```
rule continente_campaign : mail
{
    meta:
        author= "Ricardo P."
        description= "Catches phishing emails targeting portuguese citizens, with a Continente supermarket lure"
    strings:
        $subject_1 = "Adquira uma"
        $subject_2 = /ID#\d{4}/
        $generic_1 = "Continente" nocase
        $generic_2 = "obrigado" nocase
        $url_googleapis = /href=[3D]?['"]https?:\/\/storage\.googleapis\.com\/[\w]+\/\w+\.html#[\w]+['"]/ // Usually between 3 and 4. Added a Quoted-printable encoded =, just in case. 
        $cta_1 = "Obtenha já" nocase
        $cta_2 = "Obter agora" nocase
    condition:
        all of ($subject*)
        and #url_googleapis > 2 
        and all of ($generic*)
        and 1 of ($cta*)
}
```