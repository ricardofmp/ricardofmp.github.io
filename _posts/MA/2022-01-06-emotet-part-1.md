---
title: Emotet Malware ananlysis part 01
classes: wide
header:
  teaser: /assets/images/MA/emotet-1/emotet-1.jpg
ribbon: MidnightBlue
categories:
  - Malware-Analysis
toc: true
---

**as salamu alaykum**


# Introduction
Emotet is a Trojan available through a malware-as-a-service (MaaS) model that is primarily
spread through spam emails. The infection may arrive either via malicious script, macro-enabled
document files, or malicious link. 

#### Download the sample: [Here](https://app.any.run/tasks/f907a5b5-689a-472d-a2f7-1a2c4899fc96/)

MD5: CA06ACD3E1CAB1691A7670A5F23BAEF4

SHA1: 2EA0262CD42378AD00462D080FF18BFE994BB8FC

SHA256: 3A9494F66BABC7DEB43F65F9F28C44BD9BD4B3237031D80314AE7EB3526A4D8F

# Virustotal [VT](https://www.virustotal.com/gui/search/CA06ACD3E1CAB1691A7670A5F23BAEF4)
When scanning malware using VirusTotal website we can see that the malware is detected by 57
out of 68 security vendors as trojan malware and we can see

<p align="center">
  <img src="/assets/images/MA/emotet-1/1.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): <u> </u> </font></center> 
<br>

Size: 109.80 KB (112440 bytes)

## In Details section [VT Details](https://www.virustotal.com/gui/file/3a9494f66babc7deb43f65f9f28c44bd9bd4b3237031d80314ae7eb3526a4d8f/details)

 1- Different names of the sample

<p align="center">
  <img src="/assets/images/MA/emotet-1/2.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): <u> </u> </font></center> 

 2- Header info
<p align="center">
  <img src="/assets/images/MA/emotet-1/3.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): <u> </u> </font></center>
<br>

 Shows compilation Timestamp which can be changed. and Shows number of sections

# DiE

**open DiE to get more info about the sample**

<p align="center">
  <img src="/assets/images/MA/emotet-1/4.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): <u> </u> </font></center>
<br>

As we see that info about **file type**, **Entry point**, and **sections**. It will help us in our analysis

## Entropy:

**press over “Entropy” as in the previous figure(4)**

<p align="center">
  <img src="/assets/images/MA/emotet-1/5.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): <u></u> </font></center> 
<br>

Shows that it has **high** entropy in **.text** section which is an indicator to be packed

# PEstudio analysis

## Indicators section:

<p align="center">
  <img src="/assets/images/MA/emotet-1/6.png" />
</p>
<center><font size="3"> <u>Figure</u>(6): <u></u> </font></center>
<br>

*Level 1 is most malicious and bigger numbers “3” are less malicious
Shows different malicious indicators that help us in the analysis

## Sections section:

<p align="center">
  <img src="/assets/images/MA/emotet-1/7.png" />
</p>
<center><font size="3"> <u>Figure</u>(7): <u></u> </font></center> 
<br>

**The previous figure shows:**

    1-.text section is packed 
    2-.text section contains the entry point for the executable. This means that, in addition to
        holding the compressed data, .text section also contains the stub code responsible for
        unpacking.
        *The section which is responsible for unpacking can vary as in UPX packing 
    3-.text section is executable 
    4-.data section is writable 

## Strings section:

**press over “blacklist” to list them**

<p align="center">
  <img src="/assets/images/MA/emotet-1/8.png" />
</p>
<center><font size="3"> <u>Figure</u>(8): <u></u> </font></center> 
<br>


Strings are good indicators to know what this malware is trying to do on the system

# IDA analysis

To analyze the assemble code to know how to unpack and where to start the debugging
Open it in IDA: It shows that is low number of functions which another indicator that is packed

<p align="center">
  <img src="/assets/images/MA/emotet-1/9.png" />
</p>
<center><font size="3"> <u>Figure</u>(9): <u></u> </font></center> 
<br>

Press over “start” which located in the function as in the previous figure to get started

<p align="center">
  <img src="/assets/images/MA/emotet-1/10.png" />
</p>
<center><font size="3"> <u>Figure</u>(10): <u></u> </font></center> 
<br>


This sample of Emotet uses a customized packer. Instead of trying to reverse the algorithm to
unpack the next stage, we can use **dynamic analysis**. We will let the malware do the unpacking
for me and grab the next stage out of memory. **The process will need to allocate memory for**
**the next stage**. so it’s a good assumption that we will see a **call to VirtualAlloc**.
We need to search which function has VirtualAlloc call.
If you searched you will find that **call sub_417D50** is the unpacking routine

<p align="center">
  <img src="/assets/images/MA/emotet-1/11.png" />
</p>
<center><font size="3"> <u>Figure</u>(11): <u></u> </font></center> 
<br>


This our unpacking function: **sub_417D50**

<p align="center">
  <img src="/assets/images/MA/emotet-1/12.png" />
</p>
<center><font size="3"> <u>Figure</u>(12): <u></u> </font></center> 


## Abnormal prologue

First we need to clear **what normal epilogue and prologue are?**
    The procedure prologue and epilogue are standard initialization sequences that compilers generate for almost all of their functions

<p align="center">
  <img src="/assets/images/MA/emotet-1/13.png" />
</p>
<center><font size="3"> <u>Figure</u>(13): <u></u> </font></center> 
<br>


What is **NOT normal** here is epilogue in the last figure:
<p align="center">
  <img src="/assets/images/MA/emotet-1/14.png" />
</p>
<center><font size="3"> <u>Figure</u>(14): <u></u> </font></center> 
<br>


you don't push anything before ret this called abnormal.
normal epilogue is to pop EBP before ret. Here it will return ecx because it executes the last
instruction- top of the stackAnd the real return is from this function loc_417D9A because this is 2nd top of the stack

you don't push anything before ret this called abnormal.
normal epilogue is to pop EBP before ret. Here it will return ecx because it executes the last
instruction- top of the stackAnd the real return is from this function loc_417D9A because this is 2nd top of the stack

We need to know what is happening in this function?

<p align="center">
  <img src="/assets/images/MA/emotet-1/15.png" />
</p>
<center><font size="3"> <u>Figure</u>(15): <u></u> </font></center> 
<br>


**In the last figure we see the coming:**

    VirtualAlloc is moved to ECX, then
    ECX is moved to dword_41C218, then
    dword_41C218 is moved to ECX
    then push ECX and then ret
    And the real return is from this function loc_417D9A

So we need to know the address of this function to set a Breakpoint in x64dbg by pressing "space"

<p align="center">
  <img src="/assets/images/MA/emotet-1/16.png" />
</p>
<center><font size="3"> <u>Figure</u>(16): <u></u> </font></center> 
<br>


We know that code is packed. **We search for abnormal jumps:**

    jump or call Instructions to registers
    Jump to strange memory addresses (long jump)

Why searching for abnormal jumps? For many packers, the address to the location of where data is
being unpacked to is stored in a register (such as ecx), and that memory address is often in an entirely
different section

**I will write an article about “indicators of packed file”. InshAllah**

If we return to **start function** and search you will find it
Here we see our abnormal jmp ecx:

<p align="center">
  <img src="/assets/images/MA/emotet-1/17.png" />
</p>
<center><font size="3"> <u>Figure</u>(17): <u></u> </font></center> 
<br>


Press “space” to get its address: '00417F1F'

<p align="center">
  <img src="/assets/images/MA/emotet-1/18.png" />
</p>
<center><font size="3"> <u>Figure</u>(18): <u></u> </font></center> 
<br>

**How to Unpack in the next part. InshAllah**

# article quote
 > المنازل العليا لا تُنال إلّا بالبلاء












