import zipfile
import xml.etree.ElementTree as ET

def read_docx(path):
    with zipfile.ZipFile(path) as docx:
        xml_content = docx.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text = []
        for p in tree.iterfind('.//w:p', namespaces):
            p_text = ''.join(node.text for node in p.iterfind('.//w:t', namespaces) if node.text)
            if p_text:
                text.append(p_text)
        return '\n'.join(text)

with open('e:/shoe-ecommerce/prd.txt', 'w', encoding='utf-8') as f:
    f.write(read_docx('e:/shoe-ecommerce/UrbanSole_PRD.docx'))
