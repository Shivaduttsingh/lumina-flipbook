# How to Upload to GitHub (No Git Installed)

Since you don't have Git installed, the easiest way is to use the **Web Upload** feature.

## Step 1: Create a Repository on GitHub

1.  Log in to [GitHub](https://github.com).
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name it `lumina-flipbook`.
4.  **IMPORTANT**: Check the box **"Initialize this repository with a README"**. This is required for the upload button to appear immediately.
5.  Click **Create repository**.

## Step 2: Upload Files

1.  On your new repository page, click the **"Add file"** button (dropdown) and select **"Upload files"**.
2.  Open your project folder on your computer.
3.  **Select all files and folders** (except `node_modules` and `.git` if it exists).
    - *Tip: dragging `node_modules` will fail or take forever because it's too huge. Do NOT upload it.*
4.  Drag and drop them into the GitHub page.
5.  Wait for the upload to finish.
6.  Scroll down to "Commit changes" and click the green **Commit changes** button.

## Step 3: Connect to Netlify

Now that your code is on GitHub:
1.  Go to Netlify.
2.  "New site from Git" -> "GitHub".
3.  Select `lumina-flipbook`.
4.  Click **Deploy**.
