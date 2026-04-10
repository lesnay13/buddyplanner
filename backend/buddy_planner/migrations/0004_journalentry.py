from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("buddy_planner", "0003_alter_userprofile_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="JournalEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("entry_date", models.DateField()),
                ("psychodrama_moment", models.TextField(blank=True)),
                ("feeling_about_it", models.CharField(blank=True, max_length=255)),
                ("real_feeling", models.TextField(blank=True)),
                ("peace_balance", models.TextField(blank=True)),
                ("energy_today", models.TextField(blank=True)),
                ("notes", models.TextField(blank=True)),
                ("nutrition_facts", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="journal_entries",
                        to="buddy_planner.userprofile",
                    ),
                ),
            ],
            options={
                "ordering": ["-entry_date"],
                "unique_together": {("user", "entry_date")},
            },
        ),
    ]
