#!/bin/bash

# Script 'gi' para cambiar entre diferentes .gitignore según el remoto

function show_help() {
    echo "Uso: ./gi [github|gee|status|edit]"
    echo ""
    echo "Opciones:"
    echo "  github     - Usar .gitignore para GitHub (incluye resources/)"
    echo "  gee        - Usar .gitignore para Google Earth Engine (excluye resources/)"
    echo "  status     - Mostrar cuál .gitignore está activo"
    echo "  edit       - Editar archivos .gitignore"
    echo "  help       - Mostrar esta ayuda"
}

function switch_to_github() {
    if [ -f ".gitignore-gee" ]; then
        # Guardar el actual como backup
        cp .gitignore .gitignore-current-backup 2>/dev/null
        # Crear/restaurar el .gitignore para GitHub (más permisivo, incluye resources/)
        cat > .gitignore << 'EOF'
# .gitignore para GitHub
# Archivos de sistema
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Dependencias de Node.js (si aplica)
node_modules/
npm-debug.log*

# Archivos temporales
*.tmp
*.temp

# Archivos de configuración local
.env
.env.local
.env.production

# Archivos de IDE
.vscode/
.idea/
*.swp
*.swo

# Para GitHub: incluimos la carpeta resources/
# (el repositorio público puede mostrar los recursos)
EOF
        echo "✓ .gitignore actual guardado como backup"
        echo "✓ Usando .gitignore para GitHub"
    else
        echo "No se encontró .gitignore-gee"
    fi
}

function switch_to_gee() {
    if [ -f ".gitignore-gee" ]; then
        # Guardar el actual como backup
        cp .gitignore .gitignore-current-backup 2>/dev/null
        # Copiar el .gitignore de GEE
        cp .gitignore-gee .gitignore
        echo "✓ .gitignore actual guardado como backup"
        echo "✓ Usando .gitignore para Google Earth Engine"
    else
        echo "No se encontró .gitignore-gee"
    fi
}

function show_status() {
    echo "Estado actual del .gitignore:"
    if [ -f ".gitignore" ]; then
        echo "✓ .gitignore activo encontrado"
        echo ""
        echo "Contenido actual:"
        head -10 .gitignore
        if [ $(wc -l < .gitignore) -gt 10 ]; then
            echo "... ($(expr $(wc -l < .gitignore) - 10) líneas más)"
        fi
    else
        echo "No hay .gitignore activo"
    fi
    
    echo ""
    echo "Remotos configurados:"
    git remote -v
}

function edit_gitignore() {
    echo "¿Qué archivo .gitignore quieres editar?"
    echo "1) .gitignore (GitHub)"
    echo "2) .gitignore-gee (GEE)"
    echo "3) Ambos archivos"
    echo ""
    read -p "Selecciona una opción (1-3): " choice
    
    case $choice in
        1)
            echo "Editando .gitignore para GitHub..."
            if command -v code &> /dev/null; then
                code .gitignore
            elif command -v nano &> /dev/null; then
                nano .gitignore
            else
                vi .gitignore
            fi
            ;;
        2)
            echo "Editando .gitignore-gee para Google Earth Engine..."
            if command -v code &> /dev/null; then
                code .gitignore-gee
            elif command -v nano &> /dev/null; then
                nano .gitignore-gee
            else
                vi .gitignore-gee
            fi
            ;;
        3)
            echo "Editando ambos archivos..."
            if command -v code &> /dev/null; then
                code .gitignore .gitignore-gee
            else
                echo "Abriendo .gitignore primero..."
                if command -v nano &> /dev/null; then
                    nano .gitignore
                    echo "Ahora abriendo .gitignore-gee..."
                    nano .gitignore-gee
                else
                    vi .gitignore
                    echo "Ahora abriendo .gitignore-gee..."
                    vi .gitignore-gee
                fi
            fi
            ;;
        *)
            echo "Opción no válida"
            ;;
    esac
}

# Verificar que estamos en un repositorio git
if [ ! -d ".git" ]; then
    echo "Este directorio no es un repositorio git"
    exit 1
fi

case "$1" in
    "github")
        switch_to_github
        ;;
    "gee")
        switch_to_gee
        ;;
    "status")
        show_status
        ;;
    "edit")
        edit_gitignore
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo "Opción no válida: $1"
        show_help
        exit 1
        ;;
esac
