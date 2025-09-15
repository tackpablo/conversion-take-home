# Take-Home Assignment Implementation

## Assignment Information

Assignment instructions not posted online for privacy reason. Only the solution has been posted.

## How to Test

### Option 1: Direct Console Paste (Recommended)

Each JavaScript file automatically loads its CSS. Simply:

For files with the name format filename-Full.js:

1. Go to the target website
2. Copy and paste the JavaScript file into the console
3. Press Enter

### Option 2: Manual CSS Loading

If you prefer to load CSS manually:

1. Add this to the page head:

- Dynamic Modal
  - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tackpablo/conversion-take-home@main/dynamic-modal/modal-styles.css">`
- Footer Drawer
  - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tackpablo/conversion-take-home@main/footer-drawer/drawer-styles.css">`
- SPA DOM Manipulation
  - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tackpablo/conversion-take-home@main/spa-dom-manipulation/liftmap-styles.css">`

2. Copy and paste the JavaScript (does not include Full in name) file into the console
3. Press Enter

## References

1. Sheen button animation (button animation)
   https://codepen.io/davideast/pen/MWxvzjm

2. Minecraft Style Menu and Buttons (for button UI states)
   https://codepen.io/joexmdq/pen/EOMLzg

3. Multi Step Form with JS (reference, used as skeleton)
   https://codepen.io/im1tta/pen/QGmYmN

## Considerations and Notes

Use of AI was not forbidden, so due to the time constraints, AI was heavily used for the solution provided. A combination of both Claude and ChatGPT were used. With the design in mind, research was done on each task, and was worked through step by step as to make sure things were working as expected.

For all 3 portions, flex was used over grid, as I did not find it necessary to use grid due to the complexities when the assignments were considered a bit simpler.

Mobile responsiveness was kept in mind as the design occured, but things may have been missed.

For inserting the script, a normal href would not work due to CORS. It was updated to use a jsDelivr CDN. Once this is pasted in, the JS can be added to get all the changes.

### Dynamic Modal

For the glass effect, it was thought to be the highlighting of the new section and this was what was done. Animation for it is a cloud like effect.

The button was made to look as close to the provided image, but I was not able to achieve this. The color was also matched using a palette, but it does not seem close enough. A sheen animation has been added for effect.

On size change testing, there seems to be some kind of white div that disappears as soon as you try to click it (cannot find in the DOM).

For the modal, unicode was used for the emojis to prevent issues between browsers. You can refer to the 3rd reference for what I started the form with.

### Footer Drawer

A quick API call using the Pokémon was used for data. Fallback data provided in case API does not work.

The drawer starts off as open as to show the user immediately. There is also an animation for the chevron, but it is very hard to see. The color for the tab is different between open and closed.

Slideout has all the information regarding the amount of slides. There is also a slider that is horizontal (vertical hidden as it isn't required).

Each slide also has all the required information and can be flipped for more data (minimal). Tooltip shows some information and has a glow effect. Page size has been thought of for the hover behavior.

### SPA DOM Manipulation

Checked that all text displays properly for all viewports. For smaller viewports than desktop, it was found that the hero image will overshadow other parts of the site. This has been updated to change in size depending on viewport size.

Scrolling made smooth to the "Why Liftmap" section, as well as removal of the video icon since the link will not be opening a video anymore.

An observer has been added for changes to the site (switching betweeen different pages). Initially it was timing out/stack overflowing due to always listening for changes. What has been changed was that it will disconnect the observer, make the changes, and re-enable it.
