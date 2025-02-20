---
title: Email Phishing Analysis - "CTT package"
classes: wide
header:
  teaser: /assets/images/MA/EmailPhishing-CTT/phishing.png
ribbon: MidnightBlue
categories:
  - Phishing-analysis
toc: true
---

First posted in February 2025.

# Summary
The email sender appears to be impersonating the Portuguese postal service. However, upon further investigation, the purpose does not fully align with typical phishing motives, such as credential or credit card theft or malware distribution. That said, these possibilities cannot be ruled out due to the presence of cloaking mechanisms.

# Basic Email Analysis
The email was sent to a portuguese citizen, trying to impersonate the Portuguese postal service → CTT. 
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-CTT\Email.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): Phishing Email<u></u> </font></center>
<br>
Highly suspicious signals:

- The sender email address (info@apbmjlykyoawx[.]hdqilbzc[.]com)
- The design is totally off
- Highly suspicious URLs (Google Cloud Storage)
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-CTT\Email-URLs.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): Email-URLs<u></u> </font></center>
<br>
These 3 URLs have a “tarcking_param”, represented by the value after the “#”. This value will be appended to https[:]//malagaopensoffer[.]live/t/
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-CTT\FirstScriptRedirect.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): First script redirect<u></u> </font></center>
<br>

Which, again, redirects the user to a page under the laundershirts[.]com domain, currently unavailable.
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-CTT\SecondScriptRedirect.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): Second script redirect<u></u> </font></center>
<br>
This domain has been created in June 28th, 2024 and scanned on URLScan for the first time in July 26th 2024. 

The MO is always the same: 

HTML file hosted on Google storage **→** redirects to a intermediary website *→ spomouth[.]fyi/t/,*  *https[:]//malagaopensoffer[.]live/t/ or other* → redirects to another intermediary website → *laundershirts[.]com* or *ponelaz[.]com* (with appended IDs) → redirects to different Spammy/Affiliate marketing websites (the most prevalent being online surveys, but VPN promos were also observed)

Some of the online survey websites have different domains but are very similar to each other. By using the hash of the css file, we are able to catch thousands of submitions on URLScan:
`hash:920b8d8972275d746fd1bee5b5f1b3c20a87728ace3dbc2e90b2ae699c495f14`
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-CTT\OnlineSurvey.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): Online Survey page<u></u> </font></center>
<br>




# Indicators of Attack (IOA)

**URLs/domains:**

- spomouth[.]fyi
- malagaopensoffer[.]live
- laundershirts[.]com
- ponelaz[.]com

**Simple URLScan rule**

`hash:920b8d8972275d746fd1bee5b5f1b3c20a87728ace3dbc2e90b2ae699c495f14`

