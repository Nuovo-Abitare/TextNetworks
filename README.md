# TextNetworks
Text graphs in Javascript

## Instructions

Put the text data in the "dati" folder.
The data needs to be plain text files: no doc files, no formatting, no pdfs, no nothing. Just plain txt files.

Each file is dealt with separately.

In the **index.html** file:

in the example file, you will find an HTML line like this:

```HTML
<div class="linkhtml" id="resTotaleTesti">titolo dei dati</div>
```

It will match the statement in the javascript which we'll use to open one of your data files.

The rule is:

* for each data file there will be a DIV element with a different ID attribute

You can add as many as you like, for example one for each of your datafiles.


In the **js/index.js** file:

in the example file, you will find 

```javascript
$("#resTotaleTesti").click(function(){
	ga = null;
	visualize("Titolo della visualizzazione","dati/i_dati.text");
});
```

You will notice that **#resTotaleTesti** in the first line matches the **resTotaleTesti** in the DIV element in the HTML file.

Yeah, you got it:

* for each DIV element in the HTML file for which you want to open a text data file, you can have a copy of this piece of code with the matching ID with a # before it
* in the **visualize** function call you can customize the title of the viz and the name of the text data file in the **data** folder


In the **data/stopwords.json** file:

This contains the words which will be removed from your text. The ones in the example are for italian. You can play around with it to obtain different results.

Keep in mind: it's a JSON array.
It starts and ends with the square brackets.
Each element is in quotes.
Elements are separated by commas.
After the last element there is no comma, and neither is before the first one.

## How to view

The simplest way is to install **node.js** and then to install node.js's **http-server**.

You can find info for your operating system here:

* to install node.js: https://nodejs.org/en/
* to install http-server: https://www.npmjs.com/package/http-server	

Once you have these done, open up a terminal window, go to the folder where you installed TextNetwork and type on the command line:

http-server

when you hit __enter__ a webserver will start on your local machine (you can stop it by pressing CTRL-C in the same window). Nou you can open your web browser and navigate to:

http://localhost:8080

to see the interface and the visualizations.

Of course, if you have a domain with some free webspace you can just drop the whole folder in it (for example by using FTP) and then navigate to the folder from there.

If you want more than one TextNetwork instances, just duplicate the folder and change its name, and confugure like above.