---
title: Email Phishing Analysis - "Speeding Ticket from AMA"
classes: wide
header:
  teaser: /assets/images/MA/EmailPhishing-SpeedingTicketfromAMA/phishing.png
ribbon: MidnightBlue
categories:
  - Phishing-analysis
toc: true
---

First posted in February 2025.

# Summary
Email phishing attempt, trying to lure portuguese victims into paying a “speed ticketing fee”. Indicators show that a campaign targeting french citizens is also ongoing.

# Basic Email Analysis

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\Email.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): Phishing Email<u></u> </font></center>
<br>
The email was targeting a portuguese citizen, apparently coming directly from an official portuguese government agency (AMA - Agência para a Modernização Administrativa) who was recently victim to a [Ransomware attack](https://www.itsecurity.pt/news/news/cncs-confirma-incidente-de-ransomware-nas-infraestruturas-da-ama).

The email contains some highly suspicious signals:

- The email was sent from a **Universidade Estadual do Ceará** (Ceara’s State University) student account, which most likely has been previously compromised.
- Weird text formatting, context errors and the usage of brazilian portuguese expressions such as “Carteira de condução”, instead of the correct european portuguese expression “Carta de condução”.
- The typical sense of urgency that we are used to see in phishing emails, with the usage of expressions such as “regularize o pagamento o mais breve possível” ("Please settle the payment as soon as possible"), the payment due date set to the same day the email was sent
- In case the recipient does not comply with the payment, the punishment is disproportional (50€ fee will become 620€ plus the subtraction of 3 points on the driving’s license).
- And finally, the URL that allows the recipient to “pay the ticket”: hxxps[:]//uhu69cb8[.]s3.amazonaws[.]com/338[.]html

Even though it is perfectly clear this is a phishing attempt by now, we can continue our search.

- The AWS S3 Bucket contains an html file with a Click Funnel URL “hxxps[:]//myworkspace1b443[.]myclickfunnels[.]com/skdfjhsqkfhsqdkfjhsd” that will be opened through a “meta refresh redirect”, which will again redirect the user to a (well made) phishing page that impersonates the portuguese authentication system, where users can access all their citizenship information.
    - It is worth notice the “pwd” param with the “Kad00z” value. If the value is incorrect, it will redirect to www.gov.pt, the official domain.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\RedirectChain.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): Redirection chain, starting on the ClickFunnel URL<u></u> </font></center>
<br>
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\PhishingPage1.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): The official phishing page: “hxxps[:]//www[.]iphimedeia[.]com/wp-content/languages/loco/themes/gov/govPT/Autenticacao/Continue/Login[.]php”
<u></u> </font></center>
<br>


# Pivoting

Shodan and Fofa did not give us any particularly interesting results that could indicate a broader infrastructure.

*NOTE: We will keep an eye on this campaign and the post will be updated accordingly in the future, if necessary.*

URLScan.io, however, gave us the opportunity to find [another campaign](https://urlscan.io/result/e08c16a0-d5c8-4bdf-9e92-ae8f33fcec66/#summary), possibly targeting french citizens - hxxps[:]//**www[.]iphimedeia[.]com**/wp-content/languages/plugins/indx/svvr/fr/am/infospage[.]php

- The (basic) rule that was used to gather this finding will be at the end of the post.
- The delivery method employed by the threat actors is not clear.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\PhishingPageFrench.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): "amendes.gouv.fr" impersonation<u></u> </font></center>
<br>
Both campaigns are using hxxps[:]//www[.]iphimedeia[.]com to host the malicious pages and files. It is unclear if the website belongs to a real [“Iphimedeia” hotel](https://www.tripadvisor.co.uk/Hotel_Review-g580192-d12676183-Reviews-Iphimedeia_Luxury_Hotel_Suites-Naxos_Town_Naxos_Cyclades_South_Aegean.html) and it was compromised for payload delivery, or if it was registered by the malicious actors as a façade. However, given the domain registration date, the first option seems more likely.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\iphimedeiaRegistration.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): Domain registration date<u></u> </font></center>
<br>
## S3 Bucket

It was also possible to discover another file in a different bucket ( https://**uhu87243.s3.amazonaws.com**/0246.html), redirecting to “hxxps[:]//**www[.]iphimedeia[.]com**/wp-content/languages/loco/themes/**pt**/govPT/Autenticacao/Continue/Login[.]php”.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\PhishingPage3.png" />
</p>
<center><font size="3"> <u>Figure</u>(6): The page looks exactly the same as the first one we have found.<u></u> </font></center>
<br>
Using Burp Suite’s Intruder, we were not able to find any additional html file on those buckets.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\Intruder.png" />
</p>
<center><font size="3"> <u>Figure</u>(7): Attempting to find additinal html files in one of the buckets.<u></u> </font></center>
<br>

# Dynamic Analysis

During the DA it became obvious that, while the Threat Actors are trying to collect some personal information on the victim, their main goal is to bill the user’s credit card. They are effectively confirming the validity of the credit card (server side).

Some parameter names being sent on the requests, such as “kode”, “smya”, “knya” could give us some clues about the nationality of the developers/operators of the scam, but that would be an unproven assumption and would require further investigation.

<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\DAInicial.png" />
</p>
<center><font size="3"> <u>Figure</u>(8): Phone number form<u></u> </font></center>
<br>
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\DACartaoCredito.png" />
</p>
<center><font size="3"> <u>Figure</u>(9): Credit Card form<u></u> </font></center>
<br>
<p align="center">
  <img src="\assets\images\MA\EmailPhishing-SpeedingTicketfromAMA\DAVerificacaoBancaria.png" />
</p>
<center><font size="3"> <u>Figure</u>(10): Request being sent to the backend<u></u> </font></center>
<br>

# Indicators of Attack (IOA)

**IPs:**

104.199.41[.]243

**S3 Buckets:**

- hxxps[:]//uhu69cb8[.]s3[.]amazonaws[.]com/
- hxxps[:]//uhu87243[.]s3[.]amazonaws[.]com/

**URLs/domains:**

- https://**www[.]iphimedeia[.]com**/wp-content/languages/loco/themes/**gov**/govPT/Autenticacao/Continue/Login.php
- https://**www[.]iphimedeia[.]com**/wp-content/languages/loco/themes/**pt**/govPT/Autenticacao/Continue/Login.php
- https://**www[.]iphimedeia[.]com**/wp-content/languages/plugins/indx/svvr/fr/am/infospage.php

**Simple URLScan rule**

`page.url.keyword:https\:\/\/www.iphimedeia.com\/wp-content\/languages\/*`

