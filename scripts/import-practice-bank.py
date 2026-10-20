"""只读导入用户题库，保留工作表和原始题号，校验后输出前端 JSON。"""
import json
import re
import sys
from pathlib import Path
import openpyxl

source = Path(sys.argv[1])
workbook = openpyxl.load_workbook(source, data_only=True, read_only=True)
questions = []
for sheet, kind in zip(workbook, ['single', 'multiple', 'boolean']):
    for row_number, row in enumerate(sheet.iter_rows(min_row=3, values_only=True), 3):
        if all(value is None for value in row):
            continue
        number, prompt, answer = row[:3]
        assert number is not None and prompt and answer, (sheet.title, row_number)
        if kind == 'boolean':
            options = [{'id': value, 'text': value} for value in ['正确', '错误']]
            answers = [str(answer).strip()]
        else:
            options = [{'id': chr(65 + i), 'text': str(value).strip()}
                       for i, value in enumerate(row[3:]) if value is not None and str(value).strip()]
            answers = sorted(set(re.findall('[A-F]', str(answer).upper())))
        assert answers and set(answers) <= {item['id'] for item in options}, (sheet.title, number, answer)
        assert kind != 'single' or len(answers) == 1, (sheet.title, number)
        questions.append({'id': f'{kind}-{number}', 'type': kind, 'number': number,
                          'sheet': sheet.title, 'prompt': str(prompt).strip(),
                          'options': options, 'answers': answers})
assert len({q['id'] for q in questions}) == len(questions)
destination = Path(__file__).resolve().parents[1] / 'src/data/practice-bank.json'
destination.write_text(json.dumps({'title': source.stem, 'questions': questions}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'total': len(questions), 'types': {kind: sum(q['type'] == kind for q in questions) for kind in ['single', 'multiple', 'boolean']}}, ensure_ascii=False))
