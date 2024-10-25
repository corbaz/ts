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

// Ejecuta el comando para obtener la versión actual de Bun
const versionProcess = spawn("bun", ["--version"]);

// Muestra la versión actual de Bun al inicio del script
versionProcess.stdout.on("data", (data) => {
    console.log(yellow, `Versión actual de Bun: ${data.toString().trim()}\n`);
    mostrarOpciones(); // Llama a la función para mostrar las opciones una vez obtenida la versión
});

// Si hay algún error al obtener la versión de Bun, lo muestra
versionProcess.stderr.on("data", (data) => {
    console.log(red, `Error al obtener la versión de Bun: ${data.toString().trim()}`);
    mostrarOpciones(); // Llama a la función para mostrar las opciones incluso si hay un error
});

// Función para mostrar las opciones del sistema operativo y manejar la entrada del usuario
function mostrarOpciones() {
    console.log(blue,   "==================");
    console.log(yellow, "== Bun Upgrade! ==");
    console.log(blue,   "==================\n");

    console.log(green, "Elige tu Sistema Operativo:");
    console.log(green, "~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
    console.log(red,   "1. macOS/Linux y WSL"); // Opción para sistemas basados en Unix.
    console.log(red,   "2. Windows (PowerShell)"); // Opción para sistemas Windows.

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log(green, "\nIntroduce tu opción: ");
    rl.question("", (option) => {
        clear();

        // Variable para almacenar el comando que se ejecutará.
        let command;

        // Condición para sistemas que no son Windows y la opción 1.
        if (option === "1" && os.platform() !== "win32") {
            console.log(blue, "Instalando Bun en macOS/Linux/WSL...!!!\n");
            command = "curl -fsSL https://bun.sh/install | bash && bun --version && bun --revision";
        }
        // Condición para Windows y la opción 2.
        else if (option === "2" && os.platform() === "win32") {
            console.log(blue, "Instalando Bun en Windows...!!!\n");
            command = `powershell -Command "irm bun.sh/install.ps1 | iex; bun --version; bun --revision"`;
        } else {
            clear();
            if (option === "1" || option === "2") { 
                console.log(red, "Sistema Operativo no valido...!!!\n");
            }
            console.log(red, "UPGRADE no realizado.\n");
            rl.close();
            return;
        }

        // Ejecuta el comando usando 'spawn'.
        const process = spawn(command, { shell: true });

        process.stdout.on("data", (data) => {
            console.log(green, `> ${data}`);
        });

        process.on("close", (code) => {
            console.log(blue, `Proceso de UPGRADE finalizado con éxito. Errores ${code}\n`);
            rl.close();
        });
    });
}
