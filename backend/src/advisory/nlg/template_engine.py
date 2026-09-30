"""Multi-lingual Natural Language Generation (NLG) Engine."""
import os
import yaml
from typing import Dict, Any, List
from backend.src.utils.logger import logger

class MultiLingualNLG:
    """Renders agro-meteorological advisories into regional languages using template engines."""

    def __init__(self):
        self.translations_dir = os.path.join(os.path.dirname(__file__), "translations")
        self.templates = {}
        self._load_translations()

    def _load_translations(self):
        for lang in ["en", "hi", "mr", "ta"]:
            fpath = os.path.join(self.translations_dir, f"{lang}.yaml")
            if os.path.exists(fpath):
                with open(fpath, "r", encoding="utf-8") as f:
                    self.templates[lang] = yaml.safe_load(f)

    def render_advisory(
        self,
        template_key: str,
        params: Dict[str, Any],
        language: str = "en",
    ) -> Dict[str, Any]:
        """
        Renders title, message, and action items for the given template key and parameters.
        """
        lang = language if language in self.templates else "en"
        lang_dict = self.templates.get(lang, self.templates.get("en", {}))
        tpl = lang_dict.get(template_key)

        if not tpl:
            tpl = self.templates.get("en", {}).get(template_key, {})

        title_tpl = tpl.get("title", "Advisory for {crop}")
        msg_tpl = tpl.get("message", "Weather conditions monitored for {crop}.")
        actions = tpl.get("action_items", ["Follow standard package of practices."])

        # Render string interpolation safely
        try:
            rendered_title = title_tpl.format(**params)
        except Exception:
            rendered_title = title_tpl

        try:
            rendered_msg = msg_tpl.format(**params)
        except Exception:
            rendered_msg = msg_tpl

        return {
            "title": rendered_title,
            "message": rendered_msg,
            "action_items": actions,
            "language": lang,
        }

    def render_all_languages(
        self,
        template_key: str,
        params: Dict[str, Any],
    ) -> Dict[str, Dict[str, Any]]:
        """Render for all supported Indian languages simultaneously."""
        result = {}
        for lang in ["en", "hi", "mr", "ta"]:
            result[lang] = self.render_advisory(template_key, params, language=lang)
        return result
