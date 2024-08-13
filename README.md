# SSH Run

Traybar widget to connect to hosts declared in `~/.ssh/config` file.

## What is `~/.ssh/config` for?

The `~/.ssh/config` file is used to configure and simplify SSH client behavior on Unix-like systems. It allows you to define shortcuts for SSH connections, customize settings for specific hosts, and manage multiple configurations centrally. 

### Key Purposes:

1. **Simplify SSH Commands:** 
   - Define shortcuts with specific options, e.g., `ssh myserver` instead of a long command.

2. **Manage Multiple Hosts:** 
   - Set different usernames, ports, keys, etc., for different hosts or groups of hosts.

3. **Centralize Configuration:** 
   - Manage SSH settings in one place for easier updates and consistency.

4. **Enhance Security:** 
   - Enforce secure settings, like specific keys or disabling password authentication.

5. **Automate Connections:** 
   - Pre-configure tasks like port forwarding or command execution.

### Example:
```bash
Host myserver
    HostName 192.168.1.10
    User myuser
    Port 2200
    IdentityFile ~/.ssh/myId_rsa
```

This file streamlines SSH tasks, making connections easier to manage and more secure.

## What is `SSH Run` for?

`SSH Run` is a Linux app that adds a ssh button on the desktop tray bar. 
Clicking with the right mouse button on `SSH Run` icon will popup a menu with the list of all the SSH hosts defined in `~/.ssh/config`. 
Just select from the menu the host you want to connect to.

## How to build
`SSH Run` is built on Electron framework and can be used for debug with:

```
npm install
npm run start
```

Use 
```
npm install
npm run make
```
to build the installers (rpm and deb).

At the moment code has been tested only on Linux Mint.



