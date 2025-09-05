from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Flag
import pycountry
import random

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

countries = [
    {"country_name": country.name, "country_code": country.alpha_2.lower()}
    for country in pycountry.countries
]

# Fetch existing country codes in one query
existing_codes = {flag.country_code for flag in db.query(Flag.country_code).all()}

# Prepare new flags
new_flags = [Flag(**c) for c in countries if c["country_code"] not in existing_codes]

# Bulk insert and commit once
if new_flags:
    db.bulk_save_objects(new_flags)
    db.commit()

# Fetch all flags (including previously existing ones)
all_flags = db.query(Flag).all()

# Assign deterministic shuffled index
random.seed(42)  # fixed seed for reproducibility
shuffled_flags = all_flags[:]
random.shuffle(shuffled_flags)

for idx, flag in enumerate(shuffled_flags):
    flag.shuffled_index = idx
    db.add(flag)

print(f"Assigned shuffled_index for {len(shuffled_flags)} flags.")

db.commit()
db.close()

print(f"Inserted {len(new_flags)} new flags.")
