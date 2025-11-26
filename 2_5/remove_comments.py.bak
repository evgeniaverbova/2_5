import os
import re
import shutil

# Расширения файлов, в которых нужно удалять комментарии
EXTENSIONS = (
    ".js", ".ts", ".html", ".css",
    ".py", ".php",
    ".jsx", ".tsx",
    ".c", ".cpp", ".java", ".go"
)

# Регулярные выражения для удаления комментариев
REGEX_PATTERNS = [
    r"//.*?$",             # JS/C++ однострочные
    r"/\*.*?\*/",          # Многострочные /* ... */
    r"<!--.*?-->",         # HTML комментарии
    r"#.*?$",              # Python / shell
]

combined_regex = re.compile("|".join(f"({p})" for p in REGEX_PATTERNS),
                            re.DOTALL | re.MULTILINE)


def remove_comments_from_file(path):
    """Удаляет комментарии из указанного файла."""
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # создаём резервную копию
    shutil.copy(path, path + ".bak")

    # удаляем комментарии
    new_content = re.sub(combined_regex, "", content)

    # чистим лишние пустые строки
    new_content = re.sub(r"\n\s*\n", "\n", new_content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)


def process_folder(folder):
    """Рекурсивный обход папки и обработка файлов."""
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith(EXTENSIONS):
                full_path = os.path.join(root, file)
                print("Processing:", full_path)
                remove_comments_from_file(full_path)


if __name__ == "__main__":
    target = input("Введите путь к папке для очистки: ").strip()
    if os.path.isdir(target):
        process_folder(target)
        print("\nГотово! Все комментарии удалены.")
        print("Резервные копии доступны в *.bak")
    else:
        print("Указанная папка не существует!")
