---
title: MS Word to drop Remcos 
classes: wide
header:
  teaser: /assets/images/MA/remcosdoc/remdoc.jpg
ribbon: MidnightBlue
categories:
  - Mal-Document
toc: true
---

**As-salamu Alaykum**

# Introduction

Remcos RATs are delivered by phishing campaigns in form of Excel file and Word file, our sample is word file. Which tries to trick the user to click `Enable content` which will load the Macro code and then load the next stage. We start our analysis using [REMnux](https://remnux.org/).
Download the sample from [MalwareBazaar](https://bazaar.abuse.ch/sample/3bd5892cdc82dc4576eaf2735edb57182ae8b91c8067be305d4e801197d390cc/)

# About MS word

We will talk about basic structure of Word file. Microsoft suite comes in two two structures. Before `2007`, Microsoft used `structured storage fromat in binary` format which is old format `.doc`, `.xls`, `.ppt` such as from Word 97 (released in 1997) through Microsoft Office 2003. After 2007, Microsoft used `office open XML` format in Zip archive containing XML `.docx`. For more info see [here](https://docs.fileformat.com/word-processing/doc/)



# Metadata 
using exiftool to extract metadata about the sample which we are analyzing and get more information about it such as `filesize`, `filetype`, `Language Code`, `Comp Obj User Type` which shows the eddition of used Microsoft word, and `Template`. If there is `Normal.dotm` which is an indicator of Macro inside the Doc file. 

`exiftool 3bd5892cdc82dc4576eaf2735edb57182ae8b91c8067be305d4e801197d390cc.doc`

```vb
File Name                       : 3bd5892cdc82dc4576eaf2735edb57182ae8b91c8067be305d4e801197d390cc.doc
Directory                       : .
File Size                       : 60 KiB
File Modification Date/Time     : 2022:05:05 05:54:50-04:00
File Access Date/Time           : 2022:05:05 02:14:10-04:00
File Inode Change Date/Time     : 2022:05:05 01:55:39-04:00
File Permissions                : rw-r--r--
File Type                       : DOC
File Type Extension             : doc
MIME Type                       : application/msword
Identification                  : Word 8.0
Language Code                   : English (US)
Doc Flags                       : Has picture, 1Table, ExtChar
System                          : Windows
Word 97                         : No
Title                           : 
Subject                         : 
Author                          : 
Keywords                        : 
Comments                        : 
Template                        : Normal.dotm
Last Modified By                : 
Software                        : Microsoft Office Word
Create Date                     : 2022:04:20 02:06:00
Modify Date                     : 2022:04:20 02:06:00
Security                        : None
Code Page                       : Windows Latin 1 (Western European)
Char Count With Spaces          : 1
App Version                     : 16.0000
Scale Crop                      : No
Links Up To Date                : No
Shared Doc                      : No
Hyperlinks Changed              : No
Title Of Parts                  : 
Heading Pairs                   : Title, 1
Comp Obj User Type Len          : 32
Comp Obj User Type              : Microsoft Word 97-2003 Document
Last Printed                    : 0000:00:00 00:00:00
Revision Number                 : 1
Total Edit Time                 : 0
Words                           : 0
Characters                      : 1
Pages                           : 1
Paragraphs                      : 1
Lines                           : 1

```

# VBA extraction and analysis

Then we try to see if the Doc file has a Macros using `oleid`. If `VBA Macros` is set to `True` as we see in next figure, then yes it has Macros and the Macro is not encrypted. 
<p align="center">
  <img src="/assets/images/MA/remcosdoc/1.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): oleid output<u></u> </font></center>
<br>

Then we extract the 
We Then use `oledump.py` to see the content of the Doc file. The number on the left called `stream number` and `M` indicated that there is Macro and code. 
<p align="center">
  <img src="/assets/images/MA/remcosdoc/2.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): oledump.py output<u></u> </font></center>
<br>

We use `olevba` to extract Macros from the Doc file and analyze the `VBA` code. After extraction open the file in `VSCode`. We can use `oledump.py` to do this as well, but `olevba` summerize the important info for us.

`olevba 3bd5892cdc82dc4576eaf2735edb57182ae8b91c8067be305d4e801197d390cc.doc > vbacode.vba`

The most important is the table which summerize the VBA code and extracts the important code such as `IoCs` and suspicious functions such as `AutoOpen()`.
<p align="center">
  <img src="/assets/images/MA/remcosdoc/3.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): Extraction of the VBA code<u></u> </font></center>
<br>

But this is not enough. We will try to extract much info about the Doc by using `oledump.py` and extract the content of all the streams but if you want to short your time extract only the streams `9` and `10`. 

`oledump.py 3bd5892cdc82dc4576eaf2735edb57182ae8b91c8067be305d4e801197d390cc.doc  -s 9 > stream_9.vba`

`oledump.py 3bd5892cdc82dc4576eaf2735edb57182ae8b91c8067be305d4e801197d390cc.doc  -s 10 > stream_10.vba`

Take your time to analyze the `ASCII` to extract more info from the next two figures.
In this figure, stream 9 IoCs which enables the Doc to launch the VBA code.

```
C:\Program files\Common files\Microsoft shared\VBA\VBA7.1\VBE7.dll
C:\Windows\System32\stdole2.tlb
C:\Program files\Microsoft Office\root\Office1.6\MSWORD
ObjectLibrary
C:\Program files\Common files\Microsoft shared\OFFICE16\MSO.DLL
autoOpen
CreateObject
InstallProduct
``` 
<p align="center">
  <img src="/assets/images/MA/remcosdoc/4.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): Extraction of the VBA code of stream 9 <u></u> </font></center>
<br>

And in stream `10` which has less IoCs than stream `9`.

```
C:.\Windows.\System32\e2tlb
C:\Program files\Common files\Microsoft shared\OFFICE1.6\MSO.DLL
```
<p align="center">
  <img src="/assets/images/MA/remcosdoc/5.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): Extraction of the VBA code of stream 10 <u></u> </font></center>
<br>

For more info you can use `lazy office analyzer` tool in Windows or open the malicious word and see the Macro inside the Microsoft word application. I tried to use it but in this sample gives no info.

# IoCs

| No.  | Description             | Hash and URLs                                                |
| :--- | ----------------------- | ------------------------------------------------------------ |
| 1    | The Mal DOC file (MD5 ) |  090e1dfdcbf2185788ea14cd113cc39f                            |
| 3    | URL                     |  https://filebin.net/rf43v6qzghbj7h7b/TRY.msi                |


# Article quote

> من يحمل قنديله في صدره لا يُعنيه ظلام العالمين



