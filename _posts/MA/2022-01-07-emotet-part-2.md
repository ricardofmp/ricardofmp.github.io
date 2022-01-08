---
title: Unpacking Emotet malware part 02
classes: wide
header:
  teaser: /assets/images/MA/emotet-2/emotet-2.jpg
ribbon: MidnightBlue
categories:
  - Malware-Analysis
toc: true
---
**as salamu alaykum**



# [Part 01](https://muha2xmad.github.io/malware-analysis/emotet-part-1/) summary

 Download the sample: [Here](https://app.any.run/tasks/f907a5b5-689a-472d-a2f7-1a2c4899fc96/)

 found `VirtualAlloc` call in `sub_417D50` and its address.
 
 we search for abnormal jumps. we found `jmp ecx` and its address.

# Introduction

we will debug our sample with x32dbg tool to unpack the Emotet malware

## Notes to be taken

- What is Packing:

 A trick which is Used to avoid AV detection and analysis. 

- What is a packer: 
 A tool that compresses, encrypts, and/or modifies a malicious file format. [1](https://www.mcafee.com/blogs/enterprise/malware-packers-use-tricks-avoid-analysis-detection/#:~:text=One%20of%20the%20most%20popular,program%20against%20cracking%20or%20copying.))

- Why using packers:
 To avoid AV detection and analysis to make it harder for researchers to analyze the code


- We need to find the the original entry point (OEP).
 
 What is the OEP:  is the address of the malware's first instruction (where malicious code begins) before it was packed. [2](https://www.oreilly.com/library/view/learning-malware-analysis/9781788392501/12556df2-7825-4e43-8811-c0fabeab78d8.xhtml)

- How to find the OEP: find the `tail jump`. the tail jump It’s an unconditional jump exists in the tail of stub code , it points to 
address of unpack file. [3](https://www.0xbyte.com/unpacking-mzp-ransomware-manually/)

How to the unpack happen? [3] (https://www.0xbyte.com/unpacking-mzp-ransomware-manually/)
 As we see in the figure (1). 
 OS create stub code with packed file

- What is stub code? [3](https://www.0xbyte.com/unpacking-mzp-ransomware-manually/)
  Stub code is responsible for unpacking packed sections, when you are running the file ,the address of unpack file exists in the stub code to unpack file. So at the end of the stub code we will see an unconditional jump (tail jump), that is meant after execute the stub code will jump to the address of unpacking file.



<p align="center">
  <img src="/assets/images/MA/emotet-2/1.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): <u></u> </font></center> 
<br>

What is stack string? [answer](https://isc.sans.edu/forums/diary/Stackstrings+type+2/26192/#:~:text=This%20is%20a%20technique%20that,the%20allocated%20chunk%20of%20memory)

We need to know what is `VirtualAlloc`? [Here](https://msdn.microsoft.com/en-us/library/windows/desktop/aa366887(v=vs.85).aspx)
 Says that "Reserves, commits, or changes the state of a region of pages in the virtual address space of the calling process. Memory allocated by this function is automatically initialized to zero."
 
 **Syntax**
```
 LPVOID VirtualAlloc(
  [in, optional] LPVOID lpAddress,
  [in]           SIZE_T dwSize,
  [in]           DWORD  flAllocationType,
  [in]           DWORD  flProtect
);

```
The most important parameter of this function is `lpaddress`, **which returns the starting offset of the newly allocated memory**. where we will extract the malware then dump it.

# Start Debugging

Open our sample by x32dbg and hit the entry point

<p align="center">
  <img src="/assets/images/MA/emotet-2/2.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): <u></u> </font></center> 
<br>

We set a breakpoint over the jump instruction `jmp ecx` at the address `00417F1F` by pressing `f2`. 
because after this jump the unpack process will happen.

<p align="center">
  <img src="/assets/images/MA/emotet-2/3.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): <u></u> </font></center> 
<br>

Then we press `f9` to hit the breakpoint.

<p align="center">
  <img src="/assets/images/MA/emotet-2/4.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): <u></u> </font></center> 
<br>

Then press `f7` we jump to another function. If we analyze this function we will notice that:

 epilogue
<p align="center">
  <img src="/assets/images/MA/emotet-2/5.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): <u></u> </font></center> 
<br>

## Abnormal prologue
<p align="center">
  <img src="/assets/images/MA/emotet-2/6.png" />
</p>
<center><font size="3"> <u>Figure</u>(6): <u></u> </font></center> 
<br>

The last figure shows the abnormal prologue (1). And (2) is a suspecious instruction which we will know late that is new `VirtualAlloc`.

So we set a breakpoint over this instruction `mov edx,dword ptr ds:[41C1B4]` by `f2` and press `f9` to hit the breakpoint.

<p align="center">
  <img src="/assets/images/MA/emotet-2/7.png" />
</p>
<center><font size="3"> <u>Figure</u>(7): <u></u> </font></center> 
<br>

Now if we `follow in dump` We see that it's allocating memory.


Then Press `f8` it will `push edx` to the stack which is the value of `mov edx,dword ptr ds:[41C1B4]`. 


Then Press `f8`. There is **abnormal `ret`**. Normal `ret` value will get back to wherever it was called from. 

Here it return to this address `002302F0`. Which will be the address of the unpacking section.

<p align="center">
  <img src="/assets/images/MA/emotet-2/9.png" />
</p>
<center><font size="3"> <u>Figure</u>(9): <u></u> </font></center> 
<br>

So step over it.

In the next part we will see functions (Unpacking routine) and we will explain it on the fly in the next figure

<p align="center">
  <img src="/assets/images/MA/emotet-2/10.png" />
</p>
<center><font size="3"> <u>Figure</u>(10): <u></u> </font></center> 
<br>
 
Keep stepping over untill you reach the breakpoint. 

Then we see this funtion and step into `f7`.

<p align="center">
  <img src="/assets/images/MA/emotet-2/11.png" />
</p>
<center><font size="3"> <u>Figure</u>(11): <u></u> </font></center> 
<br>

It uses stack strings. which is mentioned above In introduction. **(1) pushes them on the stack.**

<p align="center">
  <img src="/assets/images/MA/emotet-2/12.png" />
</p>
<center><font size="3"> <u>Figure</u>(12): <u></u> </font></center> 
<br>

To get out from this function find `ret` and set a breakpoint then press `f9`

And these functions do the same as above. So step over them `f8`. 
 to see what inside a function without executing it: Double click over a function and press `-` button to get out. 

<p align="center">
  <img src="/assets/images/MA/emotet-2/13.png" />
</p>
<center><font size="3"> <u>Figure</u>(13): <u></u> </font></center> 
<br>

Untill we get to this last function. step into `f7`.

<p align="center">
  <img src="/assets/images/MA/emotet-2/14.png" />
</p>
<center><font size="3"> <u>Figure</u>(14): <u></u> </font></center> 
<br>

After we get into the function we need to analyze it **carefully**

<p align="center">
  <img src="/assets/images/MA/emotet-2/14.png" />
</p>
<center><font size="3"> <u>Figure</u>(14): <u></u> </font></center> 
<br>

As we can see `call edx` is calling `VirtualAlloc`:

   `push 40` **RWX** which is our indicator to know that this call could be `VirtuallAlloc`

<p align="center">
  <img src="/assets/images/MA/emotet-2/15.png" />
</p>
<center><font size="3"> <u>Figure</u>(15): <u></u> </font></center> 
<br>

One step over `f8` and we will get the adress of newly memory allocated in `eax`

<p align="center">
  <img src="/assets/images/MA/emotet-2/16.png" />
</p>
<center><font size="3"> <u>Figure</u>(16): <u></u> </font></center> 
<br>

Then keep stepping over and get to this function `call 22FBC0` and then one more step over. As we see in the dump section, the function writes over the newly memory allocate with the exe file. 

<p align="center">
  <img src="/assets/images/MA/emotet-2/17.png" />
</p>
<center><font size="3"> <u>Figure</u>(17): <u></u> </font></center> 
<br>

When keep stepping we see that it's copying files to the exe file
 
 `.text`

 <p align="center">
  <img src="/assets/images/MA/emotet-2/18.png" />
</p>
<center><font size="3"> <u>Figure</u>(18): <u></u> </font></center> 
<br>

 then `.rdata` then `.data` then `.reloc`

Untill we get to the last `ret 8` as shown. 

 <p align="center">
  <img src="/assets/images/MA/emotet-2/19.png" />
</p>
<center><font size="3"> <u>Figure</u>(19): <u></u> </font></center> 
<br>

**Stay awake** our file is almost finished. After the second `ret`. 


<p align="center">
  <img src="/assets/images/MA/emotet-2/20.png" />
</p>
<center><font size="3"> <u>Figure</u>(20): <u></u> </font></center> 
<br>

Now we can dump the unpacked exe. `right click` over `eax` and press `Follow in Mwmory map`

**Sorry for this Mistake in the next figure. It's `Follow in Mwmory map`**
<p align="center">
  <img src="/assets/images/MA/emotet-2/21.png" />
</p>
<center><font size="3"> <u>Figure</u>(21): <u></u> </font></center> 
<br>

Then `right click` and then press `Dump memory to File`

<p align="center">
  <img src="/assets/images/MA/emotet-2/22.png" />
</p>
<center><font size="3"> <u>Figure</u>(22): <u></u> </font></center> 
<br>

Now if we tried to open it in IDA. **We will notice that's can't be analyzed**

<p align="center">
  <img src="/assets/images/MA/emotet-2/23.png" />
</p>
<center><font size="3"> <u>Figure</u>(23): <u></u> </font></center> 
<br>

So we need to repair section headers using `PE bear` tool.

 **Before**
 <p align="center">
  <img src="/assets/images/MA/emotet-2/24.png" />
</p>
<center><font size="3"> <u>Figure</u>(24): <u></u> </font></center> 
<br>
 
 **After editing**
 <p align="center">
  <img src="/assets/images/MA/emotet-2/25.png" />
</p>
<center><font size="3"> <u>Figure</u>(25): <u></u> </font></center> 
<br>

Then change the image base: if it's different value of the OEP.

 <p align="center">
  <img src="/assets/images/MA/emotet-2/26.png" />
</p>
<center><font size="3"> <u>Figure</u>(26): <u></u> </font></center> 
<br>

## Unmap the unpacked file

How we edit the section headers? ordered steps.
 
 first: copy `Virtuall address` values into `Raw address` values.

 second: `Raw size` 
   Raw size of `.test` = Raw adress of `.rdata` - Raw adress of `.text` 
    `E000` - `1000` = `D000`

   Raw size of `.rdata` = Raw adress of `.data` - Raw adress of `.rdata` 
   `F000` - `E000` = `1000`

   Raw size of `.data` = Raw adress of `.reloc` - Raw adress of `.data`  
   `13000` - `F000` = `4000`

   Raw size of `.reloc` = still the same 
 third: 
   copy `Raw size` values into `Virtual size` values.

**After changing save the file. This is our malicious malware**


**See you in the next article. inshAllah**

# Article quote

 > على الضفةِ الأخرى لن نخشى الغرق

# Refernces

1- [https://www.mcafee.com/blogs/enterprise/malware-packers-use-tricks-avoid-analysis-detection/](https://www.mcafee.com/blogs/enterprise/malware-packers-use-tricks-avoid-analysis-detection/)

2-[https://www.oreilly.com/library/view/learning-malware-analysis/9781788392501/12556df2-7825-4e43-8811-c0fabeab78d8.xhtml](https://www.oreilly.com/library/view/learning-malware-analysis/9781788392501/12556df2-7825-4e43-8811-c0fabeab78d8.xhtml)

3-  [https://www.0xbyte.com/unpacking-mzp-ransomware-manually/](https://www.0xbyte.com/unpacking-mzp-ransomware-manually/)

4-  [https://isc.sans.edu/forums/diary/Stackstrings+type+2/26192/#:~:text=This%20is%20a%20technique%20that,the%20allocated%20chunk%20of%20memory](https://isc.sans.edu/forums/diary/Stackstrings+type+2/26192/#:~:text=This%20is%20a%20technique%20that,the%20allocated%20chunk%20of%20memory)


5- [https://msdn.microsoft.com/en-us/library/windows/desktop/aa366887(v=vs.85).aspx](https://msdn.microsoft.com/en-us/library/windows/desktop/aa366887(v=vs.85).aspx)



































