"""
SD Pawsense — Disease Name Normalization
"""


def normalize_disease_name(name: str) -> str:
    """
    Normalize a raw disease class name for display.

    Examples:
        "Fungal_infections" → "Fungal Infections"
        "demodicosis"       → "Demodicosis"
        "Healthy"           → "Healthy"
    """
    return name.replace("_", " ").strip().title()
