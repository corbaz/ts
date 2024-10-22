// bun-upgrade.ts

import { clear } from "console";
import os from "os"; // Importa el módulo 'os' para detectar el sistema operativo.
import readline from "readline"; // Importa 'readline' para permitir la entrada de usuario desde la consola.
import { spawn } from "child_process"; // Importa 'spawn' para ejecutar comandos en una nueva instancia del shell.

// Variables para colores ANSI
const red = "\x1b[31m%s\x1b[0m";
const green = "\x1b[32m%s\x1b[0m";
const yellow = "\x1b[33m%s\x1b[0m";
const blue = "\x1b[34m%s\x1b[0m";

// Borra la consola al inicio
console.clear();

console.log(blue,   "==================");
console.log(yellow, "== Bun Upgrade! ==");
console.log(blue,   "==================\n");
console.log(green,  "Elige tú Sistema Operativo:");
console.log(green,  "~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
console.log(red,    "1. macOS/Linux y WSL"); // Opción para sistemas basados en Unix.
console.log(red,    "2. Windows (PowerShell)"); // Opción para sistemas Windows.

const rl = readline.createInterface({
    input: process.stdin, // Configura 'readline' para recibir la entrada desde la consola.
    output: process.stdout, // Configura 'readline' para mostrar la salida en la consola.
});

console.log(green, "\nIntroduce tu opción: ");
rl.question("", (option) => {
    clear(); // Limpia la consola.
    
    // Variable para almacenar el comando que se ejecutará.
    let command;

    // Condición para sistemas que no son Windows y la opción 1.
    if (option === "1" && os.platform() !== "win32") {
        // Comando para instalar Bun en macOS/Linux/WSL.
        console.log(blue, "Instalando Bun en macOS/Linux/WSL...!!!\n");
        command = "curl -fsSL https://bun.sh/install | bash && bun --version && bun --revision";
    }
    // Condición para Windows y la opción 2.
    else if (option === "2" && os.platform() === "win32") {
        // Comando para instalar Bun en Windows usando PowerShell.
        console.log(blue, "Instalando Bun en Windows...!!!\n");
        command = `powershell -Command "irm bun.sh/install.ps1 | iex; bun --version; bun --revision"`;
    }
    // Si no se cumplen las condiciones anteriores, muestra un mensaje de error.
    else {
        clear(); // Limpia la consola.
        console.log(red, "Sistema Operativo no compatible.\n");
        rl.close(); // Cierra la interfaz de 'readline'.
        return; // Termina la ejecución.
    }

    // Ejecuta el comando usando 'spawn'.
    const process = spawn(command, { shell: true });

    // Captura y muestra la salida estándar del proceso en la consola.
    process.stdout.on("data", (data) => {
        console.log(green, `> ${data}`);
    });

    // Muestra un mensaje cuando el proceso se haya completado.
    process.on("close", (code) => {
        console.log(blue, `Proceso de UPGRADE finalizado con éxito. Errores ${code}\n`);
        rl.close(); // Cierra la interfaz de 'readline' cuando el proceso finaliza.
    });
});
