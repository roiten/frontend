#!/bin/bash

# Функция для обработки одного файла
process_file() {
    local file="$1"
    # Пропускаем каталоги, сокеты, и т.п. — только обычные файлы
    [[ ! -f "$file" ]] && return

    # Выводим относительный путь (если запускаем из текущей директории)
    # Используем realpath --relative-to, но если его нет — fallback
    if command -v realpath &>/dev/null; then
        rel_path="$(realpath --relative-to="$PWD" "$file")"
    else
        # Просто используем относительный путь (если вызов из поддиректории)
        rel_path="${file#./}"
    fi

    # Выводим заголовок: путь
    printf '%s\n' "$rel_path"
    # Выводим содержимое файла как есть (включая пустые строки и спецсимволы — cat безопасен)
    cat "$file"
    # Добавляем пустую строку-разделитель после содержимого (по желанию)
    echo
}

# Основной обход
export -f process_file  # экспортируем функцию для find с -exec bash -c

# Поиск всех файлов и применение функции
find . -type f -print0 | while IFS= read -r -d '' file; do
    process_file "$file"
done