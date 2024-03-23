---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: shows
title: Shows
permalink: /shows/
---

<div id="shows">
<ul>
    {% assign month = '' %}
    {% for show in site.data.shows %}
        {% assign newMonth = show.date | date: "%B %Y" %}
        {% if month != newMonth %}
            {% assign month = newMonth %} 
            <div id="month">{{ month }}</div>
        {% endif %}
        <div id="show">{{ show.date | date: "%d" }} {{ show.venue }} ({{show.location}}) {{ show.lineup }}</div>
    {% endfor %}    
</ul>
