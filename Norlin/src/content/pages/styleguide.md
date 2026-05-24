---
title: Style Guide
image: '../../images/50.jpg'
---

A paragraph looks like this — dolor amet cray stumptown fingerstache neutra food truck seitan poke cardigan waistcoat VHS snackwave celiac hella. Godard seitan shoreditch flexitarian next level trust fund man braid vegan listicle keytar bitters. Disrupt cray fashion axe unicorn lomo shaman poke glossier keffiyeh snackwave austin tattooed seitan hexagon lo-fi. Lumbersexual irony vaporware, butcher shaman.

***

## Headings by default:

# H1 Default styles for headings
## H2 Default styles for headings
### H3 Default styles for headings
#### H4 Default styles for headings
##### H5 Default styles for headings
###### H6 Default styles for headings

```markdown
## Heading first level
### Heading second level
#### Heading third level
```

***

## Lists

#### Ordered list example:

1. Poutine drinking vinegar bitters.
2. Coloring book distillery fanny pack.
3. Venmo biodiesel gentrify enamel pin meditation.
4. Jean shorts shaman listicle pickled portland.
5. Salvia mumblecore brunch iPhone migas.

```markdown
1. Order list item 1
2. Order list item 1
```

***

#### Unordered list example:

* Bitters semiotics vice thundercats synth.
* Literally cred narwhal bitters wayfarers.
* Kale chips chartreuse paleo tbh street art marfa.
* Mlkshk polaroid sriracha brooklyn.
* Pug you probably haven't heard of them air plant man bun.

```markdown
* Unordered list item 1
* Unordered list item 2
```

***

### Table

<div class="table-container">
  <table>
    <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th><th>Header 4</th><th>Header 5</th></tr>
    <tr><td>Row:1 Cell:1</td><td>Row:1 Cell:2</td><td>Row:1 Cell:3</td><td>Row:1 Cell:4</td><td>Row:1 Cell:5</td></tr>
    <tr><td>Row:2 Cell:1</td><td>Row:2 Cell:2</td><td>Row:2 Cell:3</td><td>Row:2 Cell:4</td><td>Row:2 Cell:5</td></tr>
    <tr><td>Row:3 Cell:1</td><td>Row:3 Cell:2</td><td>Row:3 Cell:3</td><td>Row:3 Cell:4</td><td>Row:3 Cell:5</td></tr>
    <tr><td>Row:4 Cell:1</td><td>Row:4 Cell:2</td><td>Row:4 Cell:3</td><td>Row:4 Cell:4</td><td>Row:4 Cell:5</td></tr>
    <tr><td>Row:5 Cell:1</td><td>Row:5 Cell:2</td><td>Row:5 Cell:3</td><td>Row:5 Cell:4</td><td>Row:5 Cell:5</td></tr>
    <tr><td>Row:6 Cell:1</td><td>Row:6 Cell:2</td><td>Row:6 Cell:3</td><td>Row:6 Cell:4</td><td>Row:6 Cell:5</td></tr>
  </table>
</div>

***

## Callouts

:::note
  Useful information that users should know, even when skimming content.
:::

:::tip
  Helpful advice for doing things better or more easily.
:::

:::important
  Key information users need to know to achieve their goal.
:::

:::warning
  Urgent info that needs immediate user attention to avoid problems.
:::

:::caution
  Advises about risks or negative outcomes of certain actions.
:::

> [!tip] You can add custom title
> And use Github style!

```markdown
:::note
  Useful information that users should know, even when skimming content.
:::
```

```markdown
:::tip
  Helpful advice for doing things better or more easily.
:::
```

```markdown
:::important
  Key information users need to know to achieve their goal.
:::
```

```markdown
:::warning
  Urgent info that needs immediate user attention to avoid problems.
:::
```

```markdown
:::caution
  Advises about risks or negative outcomes of certain actions.
:::
```

```markdown
> [!tip] You can add custom title
> And use Github style!
```

***

## Quotes

#### A quote looks like this:

> The longer I live, the more I realize that I am never wrong about anything, and that all the pains I have so humbly taken to verify my notions have only wasted my time!
>
> <cite>George Bernard Shaw</cite>

```html
> The longer I live, the more I realize that I am never wrong about anything, and that all the pains I have so humbly taken to verify my notions have only wasted my time!
>
> <cite>George Bernard Shaw</cite>
```

***

## Syntax Highlighter

```js
$('.top').click(function () {
  $('html, body').stop().animate({ scrollTop: 0 }, 'slow', 'swing');
});
$(window).scroll(function () {
  if ($(this).scrollTop() > $(window).height()) {
    $('.top').addClass("top-active");
  } else {
    $('.top').removeClass("top-active");
  };
});
```

***

## CodePen

<iframe height="300" style="width: 100%;" scrolling="no" title="[gsap/inertia] ❍  Card Animations Showcase - Challenge #2 / Entry 2" src="https://codepen.io/filipz/embed/bNNjwdE?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true">
      See the Pen <a href="https://codepen.io/filipz/pen/bNNjwdE">
  [gsap/inertia] ❍  Card Animations Showcase - Challenge #2 / Entry 2</a> by Filip Zrnzevic (<a href="https://codepen.io/filipz">@filipz</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

***

## Images

:::wide
![Man](../../images/150.jpg)
*Photo by [Malik Earnest](https://unsplash.com/photos/mans-face-grayscale-photo-xgxzqRpK0UE) on [Unsplash](https://unsplash.com/)*
:::

:::gallery
  ![Abstract](../../images/501.jpg)
  ![Bike](../../images/901.jpg)
  ![Man](../../images/509.jpg)
  ![Car](../../images/511.jpg)
  ![Building](../../images/520.jpg)
  ![Dogs](../../images/516.jpg)
  ![Skateboard](../../images/517.jpg)
  ![Camera](../../images/519.jpg)
  ![Minimalism](../../images/521.jpg)
  *Gallery / [Unsplash](https://unsplash.com/)*
:::

```markdown
:::gallery
  ![Abstract](../../images/501.jpg)
  ![Bike](../../images/901.jpg)
  ![Man](../../images/509.jpg)
  ![Car](../../images/511.jpg)
  ![Building](../../images/520.jpg)
  ![Dogs](../../images/516.jpg)
  ![Skateboard](../../images/517.jpg)
  ![Camera](../../images/519.jpg)
  ![Minimalism](../../images/521.jpg)
  *Gallery / [Unsplash](https://unsplash.com/)*
:::
```


![House](../../images/140.jpg)
*Minimalism*

```markdown
![House](../../images/140.jpg)
*Minimalism*
```

***

## Spotify Music Player

<iframe src="https://open.spotify.com/embed/track/41zMB8qTcM2xsqRq54AsdF?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

```html
<iframe src="https://open.spotify.com/embed/track/41zMB8qTcM2xsqRq54AsdF?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
```

***

## Youtube Embed

<p><iframe src="https://www.youtube.com/embed/Hd1_EXhr_fg" frameborder="0" allowfullscreen></iframe></p>

```html
<iframe src="https://www.youtube.com/embed/Hd1_EXhr_fg" frameborder="0" allowfullscreen></iframe>
```

## Vimeo Embed

<p><iframe src="https://player.vimeo.com/video/107654760" width="640" height="360" frameborder="0" allowfullscreen></iframe></p>

```html
<iframe src="https://player.vimeo.com/video/107654760" width="640" height="360" frameborder="0" allowfullscreen></iframe>
```

***