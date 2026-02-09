# InfinityFree Deployment Guide

InfinityFree is a free hosting provider that supports PHP and MySQL. Since this project is a React application, we will deploy it as a **static site**.

## Prerequisites

1.  **InfinityFree Account**: Sign up at [infinityfree.com](https://www.infinityfree.com/).
2.  **FileZilla** (Recommended): A free FTP client to upload files. You can also use the "Online File Manager" in the InfinityFree control panel.

## Step 1: Generate the Build

I have already generated the build files for you. They are located in the `dist` folder in your project directory.

If you ever need to regenerate them, run this command in your terminal:
```bash
npm run build
```

## Step 2: Prepare for Upload

Locate the **`dist`** folder in your project. The contents of this folder are what you will upload.

It should contain:
- `index.html`
- `assets/` folder
- `.htaccess` (I created this to ensure routing works correctly)

## Step 3: Upload to InfinityFree

### Option A: Using Online File Manager
1.  Log in to your InfinityFree Client Area.
2.  Go to **"File Manager"**.
3.  Open the **`htdocs`** folder.
4.  **Delete** the default `index2.html` or any other default files.
5.  **Upload** all files and folders **FROM INSIDE** your local `dist` folder to the `htdocs` folder.
    - *Do not upload the `dist` folder itself, just its contents.*

### Option B: Using FileZilla (FTP)
1.  Open FileZilla.
2.  Enter your **FTP Host**, **Username**, and **Password** (found in your InfinityFree "FTP Details").
3.  Connect.
4.  On the right side (Remote site), open the **`htdocs`** folder.
5.  On the left side (Local site), navigate to your project's `dist` folder.
6.  Select all files inside `dist` and drag them into `htdocs` on the right.

## Step 4: Verification

Visit your InfinityFree domain (e.g., `your-site.rf.gd`). Your Flipbook application should now be live!
