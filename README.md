# NTYwebTimer (No Thank You, Website Timer!)

A TamperMonkey userscript that bypasses artificial waiting timers on websites by speeding them up significantly, reducing 10-second waits to just 1-2 seconds.

## 🚀 Features

- **Speed Up Timers**: Accelerates `setTimeout` and `setInterval` delays by 200x (configurable)
- **Auto-Click Buttons**: Automatically detects and clicks "waiting" buttons when they become active
- **Smart Detection**: Uses MutationObserver to catch dynamically added or modified elements
- **Customizable**: Easy to adjust speed multiplier and target domains

## 📋 Requirements

- A userscript manager browser extension (Select only one you prefer):
  - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
  - [Greasemonkey](https://www.greasespot.net/) (Firefox)
  - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

## 🔧 Installation

1. Install a userscript manager (Tampermonkey recommended)
2. Click on the Tampermonkey icon and select "Create a new script"
3. Copy and paste the entire script content
4. **Important**: Modify the `@match` directives to include your target website(s)
5. Save the script (Ctrl+S or Cmd+S)

## ⚙️ Configuration

### Changing Target Websites

Edit the `@match` lines in the script header to specify which websites the script should run on:

```javascript
// @match        *://*.example.com/*
// @match        *://*.yourwebsite.com/*
```

You can add as many `@match` lines as needed for different domains.

### Adjusting Speed Multiplier

By default, timers are sped up 200x. To change this:

```javascript
const SPEEDUP = 200;  // Change this value (higher = faster)
```

- `100` = 10 seconds becomes 0.1 seconds
- `200` = 10 seconds becomes 0.05 seconds (default)
- `500` = 10 seconds becomes 0.02 seconds

### Timer Range

The script only affects timers between 800ms and 15,000ms (0.8 to 15 seconds). To adjust this range:

```javascript
if (typeof delay === 'number' && delay >= 800 && delay <= 15000) {
    // Modify these values: minimum (800) and maximum (15000)
}
```

## 🎯 How It Works

1. **Timer Interception**: Monkey-patches `setTimeout` and `setInterval` to detect and speed up delays in the specified range
2. **Button Detection**: Continuously scans for buttons with "Wait" text or waiting-related CSS classes
3. **Auto-Activation**: Removes disabled states from buttons and automatically clicks them
4. **DOM Monitoring**: Uses MutationObserver to catch dynamically loaded content

## 📝 Technical Details

### Targeted Elements

The script looks for:
- Links with class `cursor-wait` or `bg-[#1A56DB]/70`
- Elements containing "Wait" or "..." text
- Links without `href` or `data-href` attributes

## 🐛 Troubleshooting

### Script Not Working

1. Ensure the website domain is included in `@match` directives
2. Check browser console (F12) for `[fastwait]` log messages
3. Try adjusting the `SPEEDUP` value
4. Verify Tampermonkey is enabled and the script is active

### Button Not Auto-Clicking

Some websites may use different HTML structures. You may need to modify the selector in:

```javascript
document.querySelectorAll('a.cursor-wait, a.bg-[#1A56DB]\\/70, a:not([href]):not([data-href])')
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Shengwei Xiong** ([@itsShiroharu](https://github.com/itsShiroharu))

## 🔗 Links

- GitHub Repository: [NTYwebTimer](https://github.com/itsShiroharu/NTYwebTimer)

## 📊 Changelog

### Version 1.0
- Initial release
- Timer speedup functionality
- Auto-click button activation
- MutationObserver implementation

---

**Disclaimer**: This script is provided as-is for educational purposes. Use at your own risk and always respect website terms of service.
