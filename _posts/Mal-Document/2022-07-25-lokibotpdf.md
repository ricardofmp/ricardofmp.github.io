---
title: Analysis of a PDF file downloads Lokibot 
classes: wide
header:
  teaser: /assets/images/MA/lokibotpdf/loki.png
ribbon: MidnightBlue
categories:
  - Mal-Document
toc: true
---

**As-salamu Alaykum**

# Introducion

This sample is from Lokibot trojan which steals the credential information from web browsser, FTP server, SMTP server. This sample is a **PDF** file and our purpose of this blog is how to analyze a PDF file.

# About PDF

## Ability of a PDF file

A PDF file can impelemnt droppers, downloader, or exploit PDF reader application's vulnerabilities. 

## PDF sttucture

- PDF header: Contains info about the version of the PDF such as %PDF-1.6

- Body: 
  
  - Streams: a sequence of bytes such as images or data, which comes in encoded data.

  - Objects: How to render documanets which can include text or javascript.

  - Others such as names, dictionaries, strings, and arrays.

- Cross-reference table: contains the offsets of file's objects.

- Trailer: contains the offset of xref table, and number of objects, /Root.

Dictionary entry is an item between << >> and starts with slash / such as /Root which is the first object will be processed after loading the PDF file, /Root could be found in the Trailer section.

Suspecious keywords found when analyzing and their indications:

 - /Js, /JavaScript: To execute embedded javascript

 - /Launch, /EmbeddedFiles: To launch exeternal or embedded files

 - /URI: To interact with URLs

 - /OpenAction, /AA: To open an action

 - /FlateDecode: uses the zlib/deflate decompression method.

A comment in PDF starts with %

About objects:

````cs

obj 1 0: % first number is ID, second number is version

type: catalog % catalog is an example, type can be empty.

Referencing: 3 0 R % object 1 0 refernces to 3 0, R indicates of referencing

........ % content of the object

endobj % the object ends with
````

For more info aboud PDF see [this](https://www.pdfprof.com/PDF_Image.php?idt=6197&t=41).

# Methodology 

use pdfid.py or peepdf.py:

 - to perform an initial assessment by summarizing risky aspects

pdf-parser.py: 

 - to locate objects in file.pdf that include JavaScript

 - to examine the contents of objects

 - to decode the stream embedded from object

 - to extract only the list of URL

 - Follow object referencing to find the goal.

If you use peepdf.py and found that it has /EmbeddedFiles, start analyzing the object where is /EmbeddedFiles belongs to.

If you find /FlateDecode, go and try to analyze it which decodes stream.

# PDF analysis

In this sample, We received a malicious PDF file which downloads Lokibot malware. So we need to start our analysis quickly using REMnux.

We first use `pdfid.py` to get info about the PDF and what is there. As we see, it has 8 streams and 1 /EmbeddedFiles and 0 javascript files. We can use `peepdf.py` to get which object contains the /EmbeddedFiles but an error occured running. 

<p align="center">
  <img src="/assets/images/MA/lokibotpdf/1.png" />
</p>
<center><font size="3"> <u>Figure</u>(1): pdfid.py output<u></u> </font></center>
<br>

So we will use `pdf-parser.py` and to get our embedded file. We see many objects, Then start with objects which contains /FlateDecode and if we found /EmbeddedFiles go for it. 

<p align="center">
  <img src="/assets/images/MA/lokibotpdf/2.png" />
</p>
<center><font size="3"> <u>Figure</u>(2): pdf-parser.py output<u></u> </font></center>
<br>

After scrolling down, we see object 12 conatins /FlateDecode. We try to decode it and dumping using 

<p align="center">
  <img src="/assets/images/MA/lokibotpdf/3.png" />
</p>
<center><font size="3"> <u>Figure</u>(3): After dumping the object 12<u></u> </font></center>
<br>

If we use `file` command to see its type, it's an ASCII text. Then we open `file12` using `scite` we it's useless. Some objects are useles, it takes time to find the peyload. We examine another object. When we get to object `22`, we our /EmbeddedFiles which is an indicator to that the PDF launches embedded file which has big length. Dump it to `file22` to see it's content and its type. After that we use file command, we notice that it's **Composite Document File V2 Document**  [CFBF](https://en.wikipedia.org/wiki/Compound_File_Binary_Format) is a compound document file format for storing numerous files and streams within a single file on a disk. In our case, this PDF stores an XLS file. 

<p align="center">
  <img src="/assets/images/MA/lokibotpdf/4.png" />
</p>
<center><font size="3"> <u>Figure</u>(4): After dumping the object 22 and it's an xls excel spreadsheet<u></u> </font></center>
<br>

If we uploaded file22 to [Virustotal](https://www.virustotal.com/gui/file/825b7a64db82a61656c8004bef49823d5b9fe4f52fae744f5dc927b3e75a994b/detection) we will find it already uploaded and it's malicous. Our purpose is to get the main payload and that's it. 

<p align="center">
  <img src="/assets/images/MA/lokibotpdf/5.png" />
</p>
<center><font size="3"> <u>Figure</u>(5): Virustotal analysis of xls dumped from PDF<u></u> </font></center>
<br>


# Dynamic analysis

We will open FlareVM which has our installed tools. We need to install PDF reader such as Foxit reader, and Microsoft office. 

First, open `fakenet-ng`, if the malicious PDF tries to connect and download from internet, this PDF sample opens an xls spredsheet.

Then open the PDF. In foxit reader, disable safe mode and run the malicious PDF in privilage mode. 

We open `Attachments`, we see there's an attachment which will be our `xls` spredsheet file. You can open it manually. Double click on it and allow to open it. Then it will open an xls excel spredsheet. **Save** this attachment on your `Desktop` from foxit reader as shown. 

<p align="center">
  <img src="/assets/images/MA/lokibotpdf/6.png" />
</p>
<center><font size="3"> <u>Figure</u>(6): When opening the PDF<u></u> </font></center>
<br>


# IoCs

PDF file: `da9c3deb08bfc6a2e7930a4c8f1bd81b5ebffbb09b44027c74ea41ebf7149f8b`

xls sheet: `825b7a64db82a61656c8004bef49823d5b9fe4f52fae744f5dc927b3e75a994b`


# Article quote

> إلهي ، ماذا وجد من فقدك وما الذي فقد من وجدك

# REF

- [hybrid-analysis](https://hybrid-analysis.com/sample/da9c3deb08bfc6a2e7930a4c8f1bd81b5ebffbb09b44027c74ea41ebf7149f8b/62dd55e6713b0c2fa0315c06)
