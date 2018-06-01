//This is the script that will replace imperial units with metric one
//The tasks/steps to follow:
//1. Find the imperial units
//2. find the numerical value (if there is one)
//3. convert from imperial value to metric value
//4. replace expression

//[resolved]BUG FOUND : Differentiate between '.' and ','. one is fraction the other is magnitude
//so we turn (\d*\.?,?\d+)\s to (\d*\.?[,?\d+]*)\s
//but now this doesn't take numbers with commas and points (i.e 567,789.93)
//so we change our expression to ([\d+,?]*\.?\d*)\s

//[resolved]BUG FOUND: converted the word miles even when no numebr is provided (i.e turning 'several miles' to 'several kilometers' )
//so we change our expression to ([\d+,?]*\.?\d+)\s
//this way we garuntee there's atleast one number

//BUG Found: since we are modifyinh innerHTML , the script sometimes modified attributes and
//text within the HTML tags, which messed up the formattig of the webpage.
//So first we create a treewlaker that will inspect only the TEXT NODES in our webpage
//hence we ensure we only modify text between tags and the tags themsleves and their attributes
//this produced a side issue where the browser would escape the < and > characters, and so I
//added ♥™↓ after each < and > to mark them as charcaters entered by this script
//after which I replace the <♥™↓ and >♥™↓  by < and > only using innerHTML (as it won't escape the characters).




//hanged to ([\d+,?]*\.?\d+)-*\s* as some add a dash between the value and unit
//proposed change to explore ([\d{3},?]*\.?\d+)\s this way the formatting is more exact

var high; //holds mark tag to highlight text
var mark; //to close mark tag for highlighted text

chrome.storage.sync.get(['isLight'], function(result) {
//hihglight text we replace
if (result.isLight)
  {
  mark = "<♥™↓/mark>♥™↓";
  chrome.storage.sync.get(['highlightColor'], function(result) {
  if (result.highlightColor == "yellow")
  {
    high = "<♥™↓mark style=\"background-color:#ffe000;color:#ff5c5c\">♥™↓";
    replace(high,mark,changeTag);

  }
  else
  {
    high = "<♥™↓mark style=\"color:#ffe000;background-color:#ff5c5c\">♥™↓";
    replace(high,mark,changeTag);
    }
  })

  }
else
  {
  high = '';
  mark = '';
  replace(high,mark);
  }
})



var replace = function(high,mark,callback)
{
  var walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT);

    while(walker.nextNode()) {
  convert(high,mark,walker.currentNode);
}
  typeof callback === 'function' && callback();

}

var changeTag = function()
{
  document.body.innerHTML = document.body.innerHTML.replace(/&lt;♥™↓/g,'<').replace(/&gt;♥™↓/g,'>');
}
var convert = function(high,mark,node){ //function that will convert + replace units
//regex expression we're looking for
//MILES

var mi = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*mi\b/i; //only changes shorthand for miles (mi)
var mile = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*mile(s?)\b/i; //changes the mile(s)
//apparently some ppl use $nbsp for space  - the more you know ¯\_(ツ)_/¯
// var test =/(\d*\.?,?\d+)\s?mi(le(s?))?\b/g //a combination of the previous expressions
//doesn't account for typos of 12..34 or 12,,34

//INCHES
var iN = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*in\b/i; //only changes shorthand for inches (in)
var inch = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*inch(es)?\b/i; //changes the inch(es)

//FOOT
var ft = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*ft\b/i; //only changes shorthand for foot (ft)
var feet = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*f((ee)|(oo))t\b/i; //changes the feet

//YARD
var yd = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*yd\b/i; //only changes shorthand for yard (yd)
var yard = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*yard(s?)\b/i; //changes the yard

//OUNCE
var oz = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*oz\b/i; //only changes shorthand for ounce (oz)
var ounce = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*ounce(s?)\b/i; //chnages the ounce(s)

//POUND
var lb = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*lb(s?)\b/i; //only changes shorthand for pound (lb)
var pound = /([\d+,?]*\.?\d+)-*\s*(&nbsp;)*pound(s?)\b/i; //chnages the pound(s)


while (true) //changes pound(s)
{
  var arrayHold = pound.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var milesValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the pounds value
  var kValue = Math.round(unitValue * 0.453592 * 100) / 100;
  var s = arrayHold[3]; //to add the s if needed
  var replacementStr = high + kValue + " kilogram" + s + mark;
  node.nodeValue = node.nodeValue.replace(pound, replacementStr);
}

while (true) //changes lb (shorthand for pound)
{
  var arrayHold = lb.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the pounds value
  var kgValue = Math.round(unitValue * 0.453592 * 100) / 100;
  var replacementStr = high + gValue + " kg" + mark;
  node.nodeValue = node.nodeValue.replace(lb, replacementStr);
}

while (true) //changes ounce(s)
{
  var arrayHold = ounce.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var milesValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the ounces value
  var kValue = Math.round(unitValue * 28.3495 * 100) / 100;
  var s = arrayHold[3]; //to add the s if needed
  var replacementStr = high + kValue + " gram" + s + mark;
  node.nodeValue = node.nodeValue.replace(ounce, replacementStr);
}

while (true) //changes oz (shorthand for ounce)
{
  var arrayHold = oz.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '').replace(',', '')); //the ounces value
  var gValue = Math.round(unitValue * 28.3495 * 100) / 100;
  var replacementStr = high + gValue + " g" + mark;
  node.nodeValue = node.nodeValue.replace(oz, replacementStr);
}

while (true) //changes yard(s)
{
  var arrayHold = yard.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the yard value
  var mValue = Math.round(unitValue * 0.9144 * 100) / 100;
  var s = arrayHold[3]; //to add the s if needed
  var replacementStr = high + mValue + " meter" + s + mark;
  node.nodeValue = node.nodeValue.replace(yard, replacementStr);
}

while (true) //changes yd (shorthand for yard)
{
  var arrayHold = yd.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the yard value
  var mValue = Math.round(unitValue * 0.9144 * 100) / 100;
  var replacementStr = high + mValue + " m" + mark;
  node.nodeValue = node.nodeValue.replace(yd, replacementStr);
}

while (true) //changes feet/foot
{
  var arrayHold = feet.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the feet value
  var mValue = Math.round(unitValue * 0.3048 * 100) / 100;
  var s = arrayHold[4]; //to decide if the unit is plural(feet) or singular (foot)
  if (s == "ee") {
    s = 's';
  } else {
    s = '';
  }
  var replacementStr = high + mValue + " meter" + s + mark;
  node.nodeValue = node.nodeValue.replace(feet, replacementStr);
}

while (true) //changes ft (shorthand for foot)
{
  var arrayHold = ft.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the feet value
  var mValue = Math.round(unitValue * 0.3048 * 100) / 100;
  var replacementStr = high + mValue + " m" + mark;
  node.nodeValue = node.nodeValue.replace(ft, replacementStr);
}


while (true) //changes inch(es)
{
  var arrayHold = inch.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the inches value
  var cmValue = Math.round(unitValue * 2.54 * 100) / 100;
  var replacementStr = high + cmValue + " cm" + mark;
  node.nodeValue = node.nodeValue.replace(inch, replacementStr);
}

while (true) //changes in (shorthand for inch)
{
  var arrayHold = iN.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var unitValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the inches value
  var cmValue = Math.round(unitValue * 2.54 * 100) / 100;
  var replacementStr = high + cmValue + " cm" + mark;
  node.nodeValue = node.nodeValue.replace(iN, replacementStr);
}


while (true) //changes mile(s)
{
  var arrayHold = mile.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var milesValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the miles value
  var kmetersValue = Math.round(milesValue * 1.609344 * 100) / 100;
  var s = arrayHold[3];
  var replacementStr = high + kmetersValue + " kilometer" + s + mark;
  node.nodeValue = node.nodeValue.replace(mile, replacementStr);
}

while (true) //changes mi
{
  var arrayHold = mi.exec(node.nodeValue);
  if (!arrayHold) {
    break;
  };
  var milesValue = parseFloat(arrayHold[1].replace(/,/g, '')); //the miles value
  var kmetersValue = Math.round(milesValue * 1.609344 * 100) / 100;
  var replacementStr = high + kmetersValue + " km" + mark;
  node.nodeValue = node.nodeValue.replace(mi, replacementStr);
}
}
