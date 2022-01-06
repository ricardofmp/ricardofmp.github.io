---
title: Emotet Malware 0x01
classes: wide
header:
  teaser: /assets/images/MA/emotet-1.jpg
ribbon: MidnightBlue
categories:
  - Malware-Analysis
toc: true
---
/assets/images/MA/1.png
# Introduction
Emotet is a Trojan available through a malware-as-a-service (MaaS) model that is primarily
spread through spam emails. The infection may arrive either via malicious script, macro-enabled
document files, or malicious link.

#### Download the sample: [Here](https://app.any.run/tasks/f907a5b5-689a-472d-a2f7-1a2c4899fc96/)
MD5: CA06ACD3E1CAB1691A7670A5F23BAEF4
SHA1: 2EA0262CD42378AD00462D080FF18BFE994BB8FC
SHA256: 3A9494F66BABC7DEB43F65F9F28C44BD9BD4B3237031D80314AE7EB3526A4D8F

# virustotal
When scanning malware using VirusTotal website we can see that the malware is detected by 57
out of 68 security vendors as Wind32.trojan malware and we can see
![This is an image](/assets/images/MA/1.png)

Size: 109.80 KB (112440 bytes)

In Details section
1- Different names of the sample
    ![This is an image](/assets/images/MA/2.png)
2- Header info
    ![This is an image](/assets/images/MA/3.png)
    Shows compilation Timestamp which can be changed
    Shows number of sections

# Open **DiE** to get more info
![This is an image](/assets/images/MA/4.png)
As we see that info about **file type**, **Entry point**, and **sections**. It will help us in our analysis

## Entropy: press over “Entropy” as in the previous figure
![This is an image](/assets/images/MA/5.png)
Shows that it has **high** entropy in **.text** section which is an indicator to be packed

# PEstudio analysis


