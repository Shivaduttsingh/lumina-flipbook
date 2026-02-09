# Netlify Deployment Guide

Netlify is one of the easiest ways to host React applications for free.

## Option 1: Drag & Drop (Easiest)

1.  **Generate Build**: ensure you have your `dist` folder ready.
    ```bash
    npm run build
    ```
2.  **Log in**: Go to [app.netlify.com](https://app.netlify.com) and log in.
3.  **Deploy**:
    *   Go to the "Sites" tab.
    *   Scroll down to the "Want to deploy a new site without connecting to Git?" section.
    *   **Drag and drop** your `dist` folder into that box.
4.  **Done**: Your site is live!

> **Note**: I have included a `netlify.toml` file in your project. When dragging and dropping, Netlify might not read this automatically if it's outside the `dist` folder.
> *   **Important**: Copy `netlify.toml` into your `dist` folder before dragging it if you encounter 404 errors on refresh (though for this app currently, it's not strictly necessary).
> *   *Alternatively*, just dragging the `dist` folder usually works fine for simple apps.

## Option 2: Git Integration (Recommended for CI/CD)

1.  Push your code to GitHub, GitLab, or Bitbucket.
2.  Log in to Netlify and click **"Add new site"** -> **"Import from existing project"**.
3.  Connect your Git provider and select your repository.
4.  Netlify will detect the settings automatically from the `netlify.toml` file I created.
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
5.  Click **"Deploy"**.

## Why `netlify.toml`?
I created a `netlify.toml` file in your project root. This file tells Netlify how to build your site and how to handle routing (redirecting all traffic to index.html), which is crucial for React Single Page Applications (SPAs).
