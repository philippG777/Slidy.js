/*!
 *slidy.js JavaScript Library v1.0
 *Copyright philippG777 2017
 *https://github.com/philippG777/Slidy.js
 *self work is licensed under the BSD 2-Clause License.
 *To view a copy of self license, visit https://opensource.org/licenses/BSD-2-Clause.
 */

/*
NOTE: caching is currently not implemented
*/
"use strict";

function Slidy(id)
{
    var self = this;
    self.id = id;
    self.div = document.getElementById(id);
    self.iframes = [];
    self.iframeCount = 0;
    self.slides = [];
    self.slideCount = 0;
    self.speed = 10000;
    self.animationSpeed = 1;

    self.running = false;

    for (var i = 0; i < 2; i++)  // create iframes
    {
        self.iframes[i] = document.createElement("iframe");
        self.div.appendChild(self.iframes[i]);
    }

    self.iframes[0].className = "active";

    self.addSlide = function (url)
    {
        self.slides.push(url);
    };

    self.setSpeed = function (speed)
    {
        self.speed = speed * 1000;
    };

    self.setAnimationSpeed = function (speed)
    {
        self.animationSpeed = speed;
    };

    self.slide = function ()
    {
        var len = self.slides.length;
        if (self.slideCount == len - 1)
        {
            self.slideCount = 0;
        }
        else
        {
            self.slideCount++;
        }

        self.inactiveIframe = self.iframes[self.iframeCount];
        self.iframes[self.iframeCount].className = "afterActive";

        if (self.iframeCount == 1)
        {
            self.iframeCount = 0;
        }
        else
        {
            self.iframeCount = 1;
        }
        self.iframes[self.iframeCount].className = "active";

        setTimeout(self.afterSliding, 1000);
    };

    self.afterSliding = function ()
    {
        self.inactiveIframe.className = "";
        // self.inactiveIframe.src = self.slides[self.slideCount];

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function ()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                self.inactiveIframe.srcdoc = xhr.responseText;
            }
        }
        xhr.open("GET", self.slides[self.slideCount], true);
        xhr.send();

    };

    self.finishSliding = function ()
    {
        var len = self.slides.length;
        if (self.slideCount == len - 1)
        {
            self.slideCount = 0;
        }
        else
        {
            self.slideCount++;
        }

        self.iframes[self.iframeCount].src = self.slides[self.slideCount];
        self.iframes[self.iframeCount].className = "";
        if (self.iframeCount == 1)
        {
            self.iframeCount = 0;
        }
        else
        {
            self.iframeCount = 1;
        }
        self.iframes[self.iframeCount].className = "active";
    };


    self.addStyleRules = function ()
    {
        // used to set the style for the iframes
        var style = "#" + self.id + " {position: absolute; overflow: hidden;}";    // style for main div
        style += "#" + self.id + " iframe {position: absolute; border: 0; width: 100%; height: 100%; top: 0px; left: -100%;} "; // style for iframes
        style += "#" + self.id + " iframe.active {left: 0px; transition: left " + self.animationSpeed + "s ease-out;} "; // active iframe
        style += "#" + self.id + " iframe.afterActive {left: 100%; transition: left " + self.animationSpeed + "s ease-out;}";    // after-active iframe
        var styleElement = document.createElement("style");
        styleElement.id = "slidy_js_style";
        styleElement.innerHTML = style;
        document.getElementsByTagName("head")[0].appendChild(styleElement);
    };

    self.start = function ()
    {
        self.addStyleRules();
        self.running = true;
        self.interval = setInterval(self.slide, self.speed + self.animationSpeed);
        self.iframes[0].src = self.slides[0];
        self.iframes[1].src = self.slides[1];
        self.slideCount = 1;    // reset everything
        self.iframeCount = 0;
    };

    self.stop = function ()
    {
        clearTimeout(self.interval);
        self.running = false;
    };
}
