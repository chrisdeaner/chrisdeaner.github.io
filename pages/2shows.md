---
layout: shows
title: Shows
permalink: /shows/
---

<div id="container">
<ul>
    {% assign month = '' %}
    {% assign class = '' %}
    {% assign isPast = false %}
    {% assign now = "now" | date: "%s" | times: 1 %}
    {% for show in site.data.shows %}
        {% assign showDate = show.date | date: "%s" | times: 1 %}
        
        {% if showDate < now and isPast == false %}
            {% assign class = 'class="past"' %}
            {% assign isPast = true %}
            <div id="previous"><h2>Previous Shows</h2></div>
        {% endif %}
        {% assign newMonth = show.date | date: "%B %Y" %}
        {% if month != newMonth %}
            {% assign month = newMonth %}
            <div id="month" {{ class }}>{{ month }}</div>
        {% endif %}
        <div id="show" {{ class }}>{{ show.date | date: "%d" }} {{ show.venue }} ({{show.location}}) {{ show.lineup }}</div>
    {% endfor %}    
</ul>