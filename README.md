<!-- Uses markdown syntax for neat display at github -->

# Adaptime
The purpose of Adaptime is to make a planner. The PlanCanvas is a generic DHTML element for viewing, manipulating and animating intervals like timewindows etc.

## What does it do?
The PlanCanvas let you make a canvas in which events can be added. These events in turn can be resized and moved to other time steps according to time snaps which can be set. Furthermore a type can be added to every event for convenience and there are different canvas lay-outs.
![Canvas example](https://raw.github.com/NASTYJJ/Adaptime/507a7358dd70c2ce783ee1b5223f604af930f4b4/canvas.png "Example of a simple canvas (grey) with events (orange)")

## Is it good?
PlanCanvas is lightweight and modular which is useful for small web applications or as part of a bigger application. The lay-out can be set in many ways so it can easily be adjusted to the design of a website or application.

These flags are defined, and of course the names imply that the defaults are just the opposite:

*PlanCanvas.FLAG_VERTICAL=0x01, makes the orientation of the plancanvas vertical (outlook style) instead of the default horizontal.

*PlanCanvas.FLAG_NOMOVE =0x02, disables movement of appointments within the canvas by the user.

*PlanCanvas.FLAG_NOCREATE=0x04, disables creation of new appointments on the canvas.

*PlanCanvas.FLAG_NOCROSS =0x08, disables moving appointments to other plancanvas's. This disables both dragging from AND to the plancanvas.

*PlanCanvas.FLAG_OVERLAP =0x10, allow overlapping appointments. By default if you do an action that results in overlapping appointments, that acton is reverted.

*PlanCanvas.FLAG_NORESIZE =0x20, allow movement of appointments but not resize.

## What are the alternatives?
This kind of application recently became more popular, but the most famous one is
[Google calendar](http://en.wikipedia.org/wiki/Google_Calendar)

## An example
Examples can be found in the tut (tutorial) folder.

## Where can I read more?
* Altough PlanCanvas is for personal use it can be related to [University of Wageningen (on planning theory)](http://library.wur.nl/WebQuery/clc/362181)

## Copyrights
The copyrights (2013) belong to:

- Author: Kees Klop
- Author: Jos de Jong
- Almende B.V., http://www.almende.com
- Rotterdam, The Netherlands
