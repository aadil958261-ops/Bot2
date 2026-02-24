# 🤖 Attaullah King Bot Deployment Guide

Welcome to the official deployment guide for your bot! This guide will walk you through deploying your bot to **Render** and **Bot-Hosting**.

---

## 👨‍💻 Owner Info
<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=00FF00&center=true&vCenter=true&width=435&lines=Kashif+Raza;Connect+With+Me;Developer+%26+Community+Leader" alt="Typing SVG" />

  <p align="center">
    <a href="https://whatsapp.com/channel/0029Vb7Svri7oQhZNL7e5u2b">
      <img src="https://img.shields.io/badge/Whatsapp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Whatsapp" />
    </a>
    <a href="https://m.me/j/AbZEYm9NtHS9ubSl/">
      <img src="https://img.shields.io/badge/Telegram-26A8ED?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" />
    </a>
    <a href="https://www.facebook.com/100003615741592">
      <img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" />
    </a>
  </p>
</div>

---

## 🚀 Deployment Guides

### 1. Deploy on Render
Render is a popular platform for hosting web apps and bots.

1.  **Fork/Upload**: Push your code to a GitHub repository.
2.  **Create Web Service**: On [Render](https://render.com/), click **New +** and select **Web Service**.
3.  **Connect GitHub**: Connect your GitHub account and select this repository.
4.  **Settings**:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js` (or your main file)
5.  **Environment Variables**: Add any required secrets (like `BOT_TOKEN`) in the **Environment** tab.
6.  **Deploy**: Click **Create Web Service**.

### 2. Deploy on Bot-Hosting.net
Follow these specific steps for Bot-Hosting to ensure your bot runs correctly.

1.  **Create Server**: Create a new server on [Bot-Hosting.net](https://bot-hosting.net/).
2.  **Upload Files**: Upload all your bot files to the server via the File Manager or FTP.
3.  **Startup Settings**:
    *   Go to the **Startup** tab in the sidebar.
    *   Locate the **Node Version** or **Docker Image** setting.
    *   **CRITICAL**: Select **Node.js 20** from the dropdown/settings.
4.  **Install Dependencies**: Go to the **Console** and wait for the initial setup or run `npm install`.
5.  **Start**: Click the **Start** button on the Dashboard.

---

## 🛠 Features
- High Performance
- Easy Configuration
- 24/7 Uptime (with hosting)

## 📝 License
This project is licensed under the MIT License.

---
*Created by Kashif Raza*
