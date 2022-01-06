---
title: Emotet Malware 0x01
classes: wide
header:
  teaser: /assets/images/MA/emotet-1/emotet-1.jpg
ribbon: MidnightBlue
categories:
  - Malware-Analysis
toc: true
---
as salamu alaykum

# Introduction
Emotet is a Trojan available through a malware-as-a-service (MaaS) model that is primarily
spread through spam emails. The infection may arrive either via malicious script, macro-enabled
document files, or malicious link. 

#### Download the sample: [Here](https://app.any.run/tasks/f907a5b5-689a-472d-a2f7-1a2c4899fc96/)

MD5: CA06ACD3E1CAB1691A7670A5F23BAEF4

SHA1: 2EA0262CD42378AD00462D080FF18BFE994BB8FC

SHA256: 3A9494F66BABC7DEB43F65F9F28C44BD9BD4B3237031D80314AE7EB3526A4D8F

# virustotal [VT](https://www.virustotal.com/gui/search/CA06ACD3E1CAB1691A7670A5F23BAEF4)
When scanning malware using VirusTotal website we can see that the malware is detected by 57
out of 68 security vendors as trojan malware and we can see

[![](/assets/images/MA/emotet-1/1.png)](/assets/images/MA/emotet-1/1.png)
<center><font size="3"> <u>Figure</u>(1): <u> </u> </font></center> 

Size: 109.80 KB (112440 bytes)

## In Details section [VT Details](https://www.virustotal.com/gui/file/3a9494f66babc7deb43f65f9f28c44bd9bd4b3237031d80314ae7eb3526a4d8f/details)

 1- Different names of the sample

[![](/assets/images/MA/emotet-1/2.png)](/assets/images/MA/emotet-1/2.png)
<center><font size="3"> <u>Figure</u>(2): <u> </u> </font></center> 

 2- Header info

[![](/assets/images/MA/emotet-1/4.png)](/assets/images/MA/emotet-1/4.png)
<center><font size="3"> <u>Figure</u>(3): <u> </u> </font></center>

 Shows compilation Timestamp which can be changed
 Shows number of sections

## Open **DiE** to get more info about the sample

[![](/assets/images/MA/emotet-1/4.png)](/assets/images/MA/emotet-1/4.png)
<center><font size="3"> <u>Figure</u>(4): <u> </u> </font></center>

As we see that info about **file type**, **Entry point**, and **sections**. It will help us in our analysis

## Entropy: press over “Entropy” as in the previous figure
[![](/assets/images/MA/emotet-1/5.png)](/assets/images/MA/emotet-1/5.png)
<center><font size="3"> <u>Figure</u>(5): <u></u> </font></center> 

Shows that it has **high** entropy in **.text** section which is an indicator to be packed

# PEstudio analysis

## Indicators section:

[![](/assets/images/MA/emotet-1/6.png)](/assets/images/MA/emotet-1/6.png)
<center><font size="3"> <u>Figure</u>(6): <u></u> </font></center>

*Level 1 is most malicious and bigger numbers “3” are less malicious
Shows different malicious indicators that help us in the analysis

##  Sections section:

[![](/assets/images/MA/emotet-1/7.png)](/assets/images/MA/emotet-1/7.png)
<center><font size="3"> <u>Figure</u>(7): <u></u> </font></center> 

**The previous figure shows:**
    1-.text section is packed
    2-.text section contains the entry point for the executable. This means that, in addition to
        holding the compressed data, .text section also contains the stub code responsible for
        unpacking.
        *The section which is responsible for unpacking can vary as in UPX packing
    3-.text section is executable
    4-.data section is writable

## Strings section: *press over “blacklist” to list them 
[![](/assets/images/MA/emotet-1/8.png)](/assets/images/MA/emotet-1/8.png)
<center><font size="3"> <u>Figure</u>(8): <u></u> </font></center> 

Strings are good indicators to know what this malware is trying to do on the system

# IDA analysis

To analyze the assemble code to know how to unpack and where to start the debugging
Open it in IDA: It shows that is low number of functions which another indicator that is packed
[![](/assets/images/MA/emotet-1/9.png)](/assets/images/MA/emotet-1/9.png)
<center><font size="3"> <u>Figure</u>(9): <u></u> </font></center> 

Press over “start” which located in the function as in the previous figure to get started
[![](/assets/images/MA/emotet-1/10.png)](/assets/images/MA/emotet-1/10.png)
<center><font size="3"> <u>Figure</u>(10): <u></u> </font></center> 

This sample of Emotet uses a customized packer. Instead of trying to reverse the algorithm to
unpack the next stage, we can use **dynamic analysis**. We will let the malware do the unpacking
for me and grab the next stage out of memory. **The process will need to allocate memory for**
**the next stage**. so it’s a good assumption that we will see a **call to VirtualAlloc**.
We need to search which function has VirtualAlloc call.
If you searched you will find that **call sub_417D50** is the unpacking routine

[![](/assets/images/MA/emotet-1/11.png)](/assets/images/MA/emotet-1/11.png)
<center><font size="3"> <u>Figure</u>(11): <u></u> </font></center> 

This our unpacking function: **sub_417D50**

[![](/assets/images/MA/emotet-1/12.png)](/assets/images/MA/emotet-1/12.png)
<center><font size="3"> <u>Figure</u>(12): <u></u> </font></center> 

First we need to clear **what normal epilogue and prologue are?**

The procedure prologue and epilogue are standard initialization sequences that compilers
generate for almost all of their functions

[![](/assets/images/MA/emotet-1/13.png)](/assets/images/MA/emotet-1/13.png)
<center><font size="3"> <u>Figure</u>(13): <u></u> </font></center> 

What is **NOT normal** here is epilogue in the last figure:

[![](/assets/images/MA/emotet-1/14.png)](/assets/images/MA/emotet-1/14.png)
<center><font size="3"> <u>Figure</u>(14): <u></u> </font></center> 

you don't push anything before ret this called abnormal.
normal epilogue is to pop EBP before ret. Here it will return ecx because it executes the last
instruction- top of the stackAnd the real return is from this function loc_417D9A because this is 2nd top of the stack

you don't push anything before ret this called abnormal.
normal epilogue is to pop EBP before ret. Here it will return ecx because it executes the last
instruction- top of the stackAnd the real return is from this function loc_417D9A because this is 2nd top of the stack

We need to know what is happening in this function?

[![](/assets/images/MA/emotet-1/15.png)](/assets/images/MA/emotet-1/15.png)
<center><font size="3"> <u>Figure</u>(15): <u></u> </font></center> 

**In the last figure we see the coming:**
    VirtualAlloc is moved to ECX, then
    ECX is moved to dword_41C218, then
    dword_41C218 is moved to ECX
    then push ECX and then ret
    And the real return is from this function loc_417D9A

So we need to know the address of this function to set a Breakpoint in x64dbg by pressing "space"

[![](/assets/images/MA/emotet-1/16.png)](/assets/images/MA/emotet-1/16.png)
<center><font size="3"> <u>Figure</u>(16): <u></u> </font></center> 

We know that code is packed. We search for abnormal jumps:
    jump or call Instructions to registers
    Jump to strange memory addresses (long jump)

Why searching for abnormal jumps? For many packers, the address to the location of where data is
being unpacked to is stored in a register (such as ecx), and that memory address is often in an entirely
different section

**I will write an article about “indicators of packed file”. Inshallah**

If we return to **start function** and search you will find it
Here we see our abnormal jmp ecx:

[![](/assets/images/MA/emotet-1/17.png)](/assets/images/MA/emotet-1/17.png)
<center><font size="3"> <u>Figure</u>(17): <u></u> </font></center> 

Press “space” to get its address: '00417F1F'

[![](/assets/images/MA/emotet-1/18.png)](/assets/images/MA/emotet-1/18.png)
<center><font size="3"> <u>Figure</u>(18): <u></u> </font></center> 












