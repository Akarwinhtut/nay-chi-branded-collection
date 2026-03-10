# Shop Website Start Guide

Use this when you want to open the bag website from `cmd`.

## Normal Start

1. Open `Command Prompt`
2. Run:

```cmd
cd /d C:\Users\HTUT\OneDrive\Desktop\website
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Stop The Server

In the same `cmd` window:

```text
Ctrl + C
```

## If Port 3000 Is Busy

Run:

```cmd
cd /d C:\Users\HTUT\OneDrive\Desktop\website\apps\shop
npm run dev -- --port 3002
```

Then open:

```text
http://localhost:3002
```

## If `node_modules` Is Missing

Run this once:

```cmd
cd /d C:\Users\HTUT\OneDrive\Desktop\website
npm install
```

Then start again:

```cmd
npm run dev
```

## Everyday Commands

Start:

```cmd
cd /d C:\Users\HTUT\OneDrive\Desktop\website
npm run dev
```

Stop:

```text
Ctrl + C
```

Open in browser:

```text
http://localhost:3000
```
