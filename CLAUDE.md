# Antigravity Kit — Claude Code Yapılandırması

Bu proje **Antigravity Kit** sistemini kullanır. Tüm agent, skill ve workflow dosyaları `.agent/` dizinindedir.

## Slash Komutları

Kullanıcı bir `/komut` yazdığında `.agent/workflows/<komut>.md` dosyasını oku ve içindeki talimatları uygula.

| Komut | Dosya | Açıklama |
|-------|-------|----------|
| `/maestro` | `.agent/workflows/maestro.md` | Akıllı orkestrasyon — karmaşık görevler |
| `/plan` | `.agent/workflows/plan.md` | Görev planlaması |
| `/deploy` | `.agent/workflows/deploy.md` | Canlıya alma |
| `/debug` | `.agent/workflows/debug.md` | Hata ayıklama |
| `/create` | `.agent/workflows/create.md` | Yeni özellik oluşturma |
| `/test` | `.agent/workflows/test.md` | Test çalıştırma |
| `/enhance` | `.agent/workflows/enhance.md` | Kod iyileştirme |
| `/orchestrate` | `.agent/workflows/orchestrate.md` | Çoklu ajan koordinasyonu |
| `/brainstorm` | `.agent/workflows/brainstorm.md` | Fikir geliştirme |
| `/preview` | `.agent/workflows/preview.md` | Değişiklikleri önizleme |
| `/status` | `.agent/workflows/status.md` | Proje durumu |
| `/ui-ux-pro-max` | `.agent/workflows/ui-ux-pro-max.md` | Gelişmiş UI/UX tasarımı |

## Agent Sistemi

Uzman ajanlar `.agent/agents/` dizinindedir. `Agent` aracıyla çağırırken agent dosyasını oku ve sistem promptu olarak kullan.

## Skill Sistemi

Skill'ler `.agent/skills/<skill-adı>/SKILL.md` konumundadır. **Yalnızca görev için gerekli olan skill dosyasını oku** — hepsini aynı anda yükleme.

## Dil

Kullanıcıyla **Türkçe** iletişim kur.
