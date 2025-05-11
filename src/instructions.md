# StreamElements Twitch Todo Widget Integration Guide

This document provides instructions on how to integrate the Todo Widget with StreamElements for your Twitch channel.

## Setup Instructions

### Step 1: Create a Custom Widget in StreamElements

1. Log in to your StreamElements dashboard: https://streamelements.com/dashboard
2. Navigate to **Streaming Tools** > **Overlays**
3. Select your existing overlay or create a new one
4. Click the **+** button to add a new widget
5. Select **Static/Custom** > **Custom Widget**

### Step 2: Copy the Widget Code

1. In the Custom Widget settings, select the **HTML** tab
2. Copy the entire contents of the `StreamElementsWidget.html` file and paste it into the HTML editor
3. Save your widget settings

### Step 3: Configure Widget Settings

Configure the widget with these recommended settings:

1. **Width**: 400px (or desired width)
2. **Height**: 500px (to accommodate multiple todos)
3. **Position**: Place it where it's visible but doesn't interfere with gameplay or other stream elements

### Step 4: Custom Fields (Optional)

If you're familiar with StreamElements' custom fields, you can add these to make the widget configurable from the dashboard:

```json
{
  "channel": {
    "type": "text",
    "label": "Channel Name",
    "value": "seailo"
  },
  "moderators": {
    "type": "text",
    "label": "Moderators (comma-separated)",
    "value": ""
  },
  "backgroundColor": {
    "type": "colorpicker",
    "label": "Background Color",
    "value": "rgba(23, 25, 35, 0.8)"
  },
  "textColor": {
    "type": "colorpicker",
    "label": "Text Color",
    "value": "#ffffff"
  },
  "accentColor": {
    "type": "colorpicker",
    "label": "Accent Color",
    "value": "#9147ff"
  }
}
```

## Using the Todo Widget

Once installed, you can control the todo list using these commands in your Twitch chat:

| Command | Description | Example |
|---------|-------------|---------|
| `!todo add [task]` | Add a new todo | `!todo add Play Elden Ring` |
| `!todo done [#]` | Mark a todo as complete | `!todo done 2` |
| `!todo del [#]` | Delete a todo | `!todo del 1` |
| `!todo clear` | Clear all todos | `!todo clear` |
| `!todo hide` | Toggle widget visibility | `!todo hide` |

Remember that only the channel owner (you) and designated moderators can use these commands.

## Troubleshooting

If you encounter issues with the widget:

1. **Widget not appearing**: Ensure the widget is activated in your overlay and that the position/size settings are correct.
2. **Commands not working**: Verify that you're using the correct command format and that you have the necessary permissions.
3. **Not connecting to chat**: The widget automatically tries to connect to your channel's chat. If it fails, it will attempt to fallback to StreamElements' built-in chat handling.

## Notes

- The todos are stored in the browser's localStorage, meaning they'll persist between streams as long as you don't clear your browser cache.
- The widget is designed to be minimally resource-intensive to avoid impacting stream performance.