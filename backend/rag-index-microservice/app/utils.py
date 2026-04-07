from __future__ import annotations
from bs4 import BeautifulSoup

import re


_TAG_RE = re.compile(r"<[^>]+>")


def strip_html_to_text(html: str) -> str:
    text = BeautifulSoup(html, "html.parser").get_text(separator=" ")
    return text