/*!
 *slidy.js JavaScript Library v1.0
 *Copyright philippG777 2017
 *https://github.com/philippG777/Slidy.js
 *This work is licensed under the BSD 2-Clause License.
 *To view a copy of this license, visit https://opensource.org/licenses/BSD-2-Clause.
 */

/*
NOTE: caching is currently not implemented
*/
"use strict";

function Slidy(id)
{
    this.id = id;
    this.div = document.getElementById(id);
    this.iframes = [];
    this.iframeCount = 0;
    this.slides = [];
    this.slideCount = 0;
    this.speed = 10000;
    this.animationSpeed = 1;
    for(var i = 0; i < 2; i++)  // create iframes
    {
        this.iframes[i] = document.createElement("iframe");
        this.div.appendChild(this.iframes[i]);
    }

    this.iframes[0].className = "active";

    this.addSlide = function(url, cache)
    {
        cache = false || cache;
        if(cache)
        {
            this.slides.push([url, "none"]);   // place for url and html-cache
        }
        else
        {
            this.slides.push([url, ""]);
        }
    };

    this.setSpeed = function(speed)
    {
        this.speed = speed * 1000;
    };

    this.setAnimationSpeed = function(speed)
    {
        this.animationSpeed = speed;
    };

    this.slide = function()
    {
        var len = this.slides.length;
        if(this.slideCount == len - 1)
        {
            this.slideCount = 0;
        }
        else
        {
            this.slideCount++;
        }

        this.inactiveIframe = this.iframes[this.iframeCount];
        this.iframes[this.iframeCount].className = "afterActive";

        if(this.iframeCount == 1)
        {
            this.iframeCount = 0;
        }
        else
        {
            this.iframeCount = 1;
        }
        this.iframes[this.iframeCount].className = "active";

        setTimeout(this.afterSliding, 1000);
    }.bind(this);

    this.afterSliding = function()
    {
        this.inactiveIframe.className = "";
        this.inactiveIframe.src = this.slides[this.slideCount][0];
    }.bind(this);

    this.finishSliding = function()
    {
        var len = this.slides.length;
        if(this.slideCount == len - 1)
        {
            this.slideCount = 0;
        }
        else
        {
            this.slideCount++;
        }

        this.iframes[this.iframeCount].src = this.slides[this.slideCount][0];
        this.iframes[this.iframeCount].className = "";
        if(this.iframeCount == 1)
        {
            this.iframeCount = 0;
        }
        else
        {
            this.iframeCount = 1;
        }
        this.iframes[this.iframeCount].className = "active";
    }.bind(this);


    this.addStyleRules = function()
    {
        // used to set the style for the iframes
        var style = "#" + this.id + " {position: absolute; overflow: hidden;}";    // style for main div
        style += "#" + this.id + " iframe {position: absolute; border: 0; width: 100%; height: 100%; top: 0px; left: -100%;} "; // style for iframes
        style += "#" + this.id + " iframe.active {left: 0px; transition: left " + this.animationSpeed + "s ease-out;} "; // active iframe
        style += "#" + this.id + " iframe.afterActive {left: 100%; transition: left " + this.animationSpeed + "s ease-out;}";    // after-active iframe
        var styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        document.getElementsByTagName("head")[0].appendChild(styleElement);
    };

    this.start = function()
    {
        this.addStyleRules();
        this.interval = setInterval(this.slide, this.speed + this.animationSpeed);
        this.iframes[0].src = this.slides[0][0];
        this.iframes[1].src = this.slides[1][0];
        this.slideCount = 1;    // reset everything
        this.iframeCount = 0;
    };

    this.stop = function()
    {
        clearTimeout(this.interval);
    };
}
