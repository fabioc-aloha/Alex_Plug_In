"""Analyze function lengths for NASA R4 compliance."""
import re
import sys

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find registerCommand patterns (name may be on same or next line)
    handlers = []
    for i, line in enumerate(lines):
        if 'registerCommand' in line:
            m = re.search(r'"(alex\.\w+)"', line)
            if not m and i + 1 < len(lines):
                m = re.search(r'"(alex\.\w+)"', lines[i + 1])
            if m:
                handlers.append((i + 1, m.group(1)))
    
    # Find push block
    push_line = None
    for i, line in enumerate(lines):
        if 'context.subscriptions.push' in line:
            push_line = i + 1
            break
    
    print(f"File: {filepath}, Total lines: {len(lines)}")
    print(f"Push block at L{push_line}")
    print(f"Commands: {len(handlers)}")
    for s, n in handlers:
        print(f"  L{s}: {n}")
    
    # Show gaps
    print("\nHandler sizes:")
    for idx in range(len(handlers) - 1):
        gap = handlers[idx + 1][0] - handlers[idx][0]
        print(f"  {handlers[idx][1]}: ~{gap} lines")
    if handlers and push_line:
        gap = push_line - handlers[-1][0]
        print(f"  {handlers[-1][1]}: ~{gap} lines")

if __name__ == '__main__':
    analyze_file(sys.argv[1] if len(sys.argv) > 1 else 'src/commandsDeveloper.ts')
