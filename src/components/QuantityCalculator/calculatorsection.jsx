<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>حاسبة الكميات - النسخة المتكاملة 1</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{
      --bg:#1a1a2e;
      --card:#16213e;
      --card2:#1e293b;
      --border:#2a3f5f;
      --text:#e2e8f0;
      --muted:#94a3b8;
      --primary:#3b82f6;
      --success:#10b981;
      --warning:#f59e0b;
      --danger:#ef4444;
      --cyan:#06b6d4;
      --purple:#8b5cf6
    }
    body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;background:var(--bg);color:var(--text);padding:16px;min-height:100vh}
    .container{max-width:900px;margin:0 auto}
    input[type="number"]{-moz-appearance:textfield}
    input[type="number"]::-webkit-outer-spin-button,input[type="number"]::-webkit-inner-spin-button{-webkit-appearance:none}
    select{cursor:pointer}

    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    /* نموذج الإدخال السريع */
    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    .quick-entry{background:var(--card);border-radius:6px;border:2px solid var(--primary);overflow:hidden;margin-bottom:20px}
    .quick-entry-header{padding:16px;background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.1));border-bottom:1px dashed rgba(59,130,246,0.4);display:flex;align-items:center;gap:12px;cursor:pointer}
    .quick-entry-header .icon{background:linear-gradient(135deg,var(--primary),var(--cyan));padding:12px 16px;border-radius:6px;font-size:24px}
    .quick-entry-header .info h2{font-size:16px;font-weight:700}
    .quick-entry-header .info p{font-size:11px;color:var(--muted);margin-top:2px}
    .quick-entry-header .toggle{font-size:16px;color:var(--primary);transition:transform 0.3s;margin-right:auto}
    .quick-entry-body{padding:16px;display:block}
    .quick-entry.collapsed .quick-entry-body{display:none}
    .quick-entry.collapsed .quick-entry-header .toggle{transform:rotate(180deg)}

    .step-section{margin-bottom:16px}
    .step-label{display:flex;align-items:center;gap:10px;margin-bottom:12px}
    .step-num{width:28px;height:28px;border-radius:6px;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
    .step-text{font-size:14px;font-weight:600}
    .step-badge{padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;background:var(--success);color:#fff;margin-right:auto}

    .place-input-row{display:flex;gap:8px;margin-bottom:12px}
    .place-select-main{flex:1;height:40px;padding:0 14px 0 36px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 14px center}
    .place-select-main:focus{outline:none;border-color:var(--primary)}
    .place-custom-input{flex:1;height:40px;padding:0 14px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;font-family:inherit}
    .place-custom-input:focus{outline:none;border-color:var(--primary)}
    .place-custom-input::placeholder{color:var(--muted)}
    .place-add-btn{height:40px;padding:0 20px;border-radius:6px;border:1px solid var(--success);background:rgba(16,185,129,0.15);color:var(--success);font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}
    .place-add-btn:hover{background:rgba(16,185,129,0.25)}
    
    .selected-places-box{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;padding:12px;background:rgba(59,130,246,0.08);border-radius:6px;border:1px solid rgba(59,130,246,0.2);min-height:44px}
    .selected-place-tag{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;background:var(--primary);color:#fff;font-size:12px;font-weight:600}
    .selected-place-tag span{cursor:pointer;font-weight:700;opacity:0.8}
    .selected-place-tag span:hover{opacity:1}

    .dims-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
    .dim-box{background:var(--bg);border-radius:6px;padding:10px;text-align:center;border:1px solid var(--border)}
    .dim-box.area{background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.3)}
    .dim-label{font-size:10px;color:var(--muted);margin-bottom:6px}
    .dim-input{width:100%;height:32px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:14px;font-weight:600;text-align:center;font-family:inherit;appearance:none;padding:0 8px 0 24px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 8px center}
    .dim-value{font-size:18px;font-weight:700;color:var(--success)}

    .main-items-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
    .main-item-chip{height:40px;padding:0 14px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s}
    .main-item-chip:hover{border-color:#475569;color:var(--text)}
    .main-item-chip.active{border-color:var(--c);background:var(--cbg);color:var(--c)}
    .main-item-chip .chip-icon{font-size:16px}

    .sub-items-section{display:none;margin-top:16px;padding-top:16px;border-top:1px dashed var(--border)}
    .sub-items-section.show{display:block}
    .sub-items-title{font-size:12px;font-weight:600;color:var(--muted);margin-bottom:12px;display:flex;align-items:center;gap:8px}
    .sub-items-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
    .sub-item-card{display:flex;align-items:center;gap:10px;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.2s}
    .sub-item-card:hover{border-color:#475569}
    .sub-item-card.selected{border-color:var(--c);background:var(--cbg)}
    .sub-item-check{width:22px;height:22px;border-radius:6px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;color:transparent;flex-shrink:0}
    .sub-item-card.selected .sub-item-check{border-color:var(--c);background:var(--c);color:#fff}
    .sub-item-info{flex:1;min-width:0}
    .sub-item-name{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .sub-item-price{font-size:10px;color:var(--muted);margin-top:2px}
    .sub-item-total{font-size:11px;font-weight:700;color:var(--success);white-space:nowrap}

    .add-section{margin-top:20px;padding-top:16px;border-top:1px solid var(--border)}
    .add-summary{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:12px;background:var(--bg);border-radius:6px}
    .add-summary-label{font-size:12px;color:var(--muted)}
    .add-summary-value{font-size:18px;font-weight:700;color:var(--success)}
    .add-btn{width:100%;height:50px;border-radius:6px;border:none;background:linear-gradient(135deg,var(--success),#059669);color:#fff;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:inherit;transition:transform 0.2s,box-shadow 0.2s}
    .add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(16,185,129,0.3)}
    .add-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed;transform:none;box-shadow:none}
    .add-btn .count{padding:4px 10px;background:rgba(255,255,255,0.2);border-radius:6px;font-size:12px}

    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    /* الفئات */
    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    .category{background:var(--card);border-radius:6px;border:1px solid var(--border);overflow:hidden;margin-bottom:12px;transition:border-color 0.3s}
    .category.expanded{border-width:2px;border-color:var(--c)}
    .category-header{display:flex;align-items:stretch;cursor:pointer}
    .category-bar{width:4px}
    .category-icon-section{display:flex;align-items:stretch;border-left:1px solid var(--border)}
    .category-icon{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px 20px;gap:6px}
    .category-icon svg{width:30px;height:30px}
    .category-code{font-size:10px;font-weight:700}
    .category-info{flex:1;padding:16px 18px}
    .category-name{font-size:17px;font-weight:700;margin-bottom:6px}
    .category-pending{background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);border-radius:6px;padding:6px 10px;margin-bottom:8px;font-size:11px;color:var(--warning);display:flex;align-items:center;gap:6px}
    .category-stats{display:flex;gap:12px;font-size:11px;color:var(--muted);margin-bottom:8px;flex-wrap:wrap}
    .category-places-tags{display:flex;gap:6px;flex-wrap:wrap;font-size:10px}
    .category-place-tag{padding:3px 8px;border-radius:6px}
    .category-total-tag{font-weight:700}
    .category-total-section{background:rgba(16,185,129,0.12);padding:16px 22px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:1px solid var(--border)}
    .category-total-label{font-size:9px;color:var(--muted)}
    .category-total-value{font-size:20px;font-weight:700;color:var(--success)}
    .category-arrow{padding:16px 18px;display:flex;align-items:center;background:var(--bg)}
    .category-arrow span{font-size:16px;transition:transform 0.3s}
    .category-body{display:none;background:rgba(0,0,0,0.1);border-top:1px dashed rgba(255,255,255,0.1);padding:16px}
    .category.expanded .category-body{display:block}

    /* الأماكن المعلقة */
    .pending-section{margin-bottom:16px;background:rgba(245,158,11,0.1);border-radius:6px;padding:14px;border:1px solid rgba(245,158,11,0.3)}
    .pending-title{font-size:12px;font-weight:700;color:var(--warning);margin-bottom:10px}
    .pending-item{display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:10px;background:var(--card);border-radius:6px}
    .pending-item:last-child{margin-bottom:0}
    .pending-place-name{font-size:12px;color:var(--text);font-weight:500;min-width:fit-content}
    .pending-select{flex:1;height:36px;padding:0 10px;border-radius:6px;border:1px solid;background:var(--bg);color:var(--text);font-size:12px;font-family:inherit}
    .pending-add-btn{width:32px;height:32px;border-radius:6px;border:1px solid var(--success);background:rgba(16,185,129,0.2);color:var(--success);font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center}

    /* البنود */
    .items-section{margin-bottom:16px}
    .items-header{font-size:12px;font-weight:500;color:var(--text);margin-bottom:10px}
    .item-card{background:var(--card);border-radius:6px;overflow:hidden;margin-bottom:8px;border:1px solid var(--border);transition:border-color 0.2s}
    .item-card.editing{border-width:2px;border-color:var(--primary)}
    .item-header{display:flex;align-items:center;cursor:pointer;padding:12px 14px;gap:8px}
    .item-card.editing .item-header{background:rgba(59,130,246,0.1)}
    .item-header-actions{display:flex;gap:6px;margin-right:8px}
    .item-header-btn{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;border:1px solid}
    .item-btn-settings{background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.3);color:var(--primary)}
    .item-btn-done{background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:var(--success)}
    .item-btn-delete{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3);color:var(--danger)}
    .item-code-badge{padding:8px 12px;border-radius:6px;margin-left:12px;font-size:11px;font-weight:500;color:#fff}
    .item-info{flex:1}
    .item-name{font-size:14px;font-weight:500;display:flex;align-items:center;gap:6px}
    .item-details{font-size:11px;color:var(--muted);font-weight:500}
    .item-total{font-size:16px;font-weight:500;color:var(--success)}
    .item-body{padding:14px;background:rgba(59,130,246,0.08);border-top:1px dashed rgba(59,130,246,0.3);display:none}
    .item-card.editing .item-body{display:block}

    /* تحرير البند */
    .item-edit-row{display:flex;gap:8px;margin-bottom:12px}
    .item-select{flex:1;height:36px;padding:0 10px 0 30px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 10px center}
    .item-add-sub-btn{width:32px;height:32px;border-radius:6px;border:1px solid var(--success);background:rgba(16,185,129,0.2);color:var(--success);font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center}

    /* الأماكن في البند */
    .places-edit-section{margin-bottom:12px}
    .places-edit-title{font-size:10px;color:var(--muted);margin-bottom:6px}
    .place-edit-row{display:flex;align-items:center;gap:6px;padding:8px 10px;background:rgba(59,130,246,0.08);border-radius:6px;border:1px solid rgba(59,130,246,0.2);margin-bottom:6px;flex-wrap:wrap}
    .place-name-select{width:80px;height:32px;padding:0 8px 0 24px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:11px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 8px center}
    .measure-type-select{width:65px;height:32px;padding:0 4px 0 20px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:11px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 6px center}
    .dim-box-inline{display:flex;align-items:center;height:32px;padding:0 8px;border-radius:6px;border:1px solid var(--border);background:var(--bg);gap:4px}
    .dim-box-inline .dim-label-text{font-size:10px;color:var(--muted);font-weight:500}
    .dim-box-inline select{border:none;background:transparent;color:var(--text);font-size:12px;font-weight:600;text-align:center;width:35px;padding:0;appearance:none;cursor:pointer}
    .dim-box-inline .dim-unit{font-size:10px;color:var(--muted)}
    .dim-separator{color:var(--muted);font-size:12px;font-weight:500}
    .manual-area-input{width:55px;height:32px;padding:0 4px;border-radius:6px;border:1px solid var(--success);background:var(--bg);color:var(--success);font-size:12px;text-align:center}
    .area-badge{padding:4px 8px;border-radius:6px;background:rgba(16,185,129,0.2);color:var(--success);font-size:12px;font-weight:500;min-width:50px;text-align:center}
    .place-delete-btn{width:26px;height:26px;border-radius:6px;border:1px solid rgba(239,68,68,0.5);background:rgba(239,68,68,0.1);color:var(--danger);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center}

    /* شروط البند */
    .conditions-edit-section{margin-bottom:12px}
    .conditions-edit-title{font-size:10px;color:var(--warning);margin-bottom:6px}
    .condition-tag{display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(245,158,11,0.1);border-radius:6px;border:1px solid rgba(245,158,11,0.2);margin-bottom:4px}
    .condition-tag span{flex:1;font-size:11px;color:var(--text);font-weight:500}
    .condition-delete-btn{width:22px;height:22px;border-radius:6px;border:1px solid rgba(239,68,68,0.5);background:rgba(239,68,68,0.1);color:var(--danger);cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center}
    .condition-add-row{display:flex;gap:8px;margin-bottom:8px}
    .condition-select{flex:1;height:40px;padding:0 14px 0 36px;border-radius:6px;border:1px solid var(--warning);background:var(--bg);color:var(--text);font-size:13px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 14px center}
    .manual-condition-btn{flex:1;height:40px;padding:0 20px;border-radius:6px;border:1px solid var(--warning);background:rgba(245,158,11,0.15);color:var(--warning);font-size:14px;font-weight:600;cursor:pointer}
    .manual-condition-input{flex:1;height:40px;padding:0 14px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px}
    .manual-condition-save{flex:1;height:40px;padding:0 20px;border-radius:6px;border:none;background:var(--success);color:#fff;font-size:13px;font-weight:600;cursor:pointer}

    /* أزرار التحرير */
    .item-actions{display:none}

    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    /* التبويبات - الشروط وملخص السعر */
    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    .tabs-container{background:var(--card2);border-radius:6px;overflow:hidden;border:1px solid var(--primary)}
    .tabs-header{display:flex;border-bottom:1px solid #334155}
    .tab-btn{flex:1;padding:12px;text-align:center;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:#64748b;border:none;border-bottom:2px solid transparent;transition:all 0.2s}
    .tab-btn.active{color:var(--c);background:var(--cbg);border-bottom-color:var(--c)}
    .tab-content{padding:14px;display:none}
    .tab-content.active{display:block}

    /* أزرار الخيارات */
    .options-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
    .options-grid-2{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
    .option-btn{height:34px;border-radius:6px;border:1px solid;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;padding:0 8px;font-size:11px;font-weight:700;color:#fff;transition:all 0.2s}
    .option-btn input{width:46px;height:26px;border-radius:6px;border:1px solid rgba(255,255,255,0.3);background:rgba(0,0,0,0.3);color:#fff;font-size:11px;font-weight:700;text-align:center;margin-right:auto}

    /* ملخص الخدمة */
    .summary-section{margin-bottom:12px}
    .summary-title{font-size:11px;font-weight:700;color:var(--warning);margin-bottom:8px}
    .summary-textarea{width:100%;min-height:120px;padding:12px;border-radius:6px;border:1px solid rgba(245,158,11,0.5);background:var(--bg);color:var(--text);font-size:12px;line-height:1.8;resize:vertical;font-family:inherit}
    .summary-text{font-size:12px;color:var(--text);line-height:2;background:var(--bg);padding:12px;border-radius:6px;min-height:60px}
    .summary-text .s-item{color:var(--primary);font-weight:600}
    .summary-text .s-area{color:var(--cyan);font-weight:600}
    .summary-text .s-place{color:var(--purple);font-weight:500}
    .summary-text .s-condition{color:var(--warning);font-weight:500}
    .summary-text .s-container{color:var(--warning);font-weight:600}
    .summary-text .s-materials{color:var(--success);font-weight:600}
    .summary-text .s-price{color:var(--success);font-weight:700}
    .summary-text .s-without{color:var(--danger);font-weight:500}

    /* شروط الفئة */
    .cat-conditions{margin-bottom:12px}
    .cat-conditions-title{font-size:10px;color:var(--warning);margin-bottom:6px}
    .cat-conditions-tags{display:flex;flex-wrap:wrap;gap:6px}
    .cat-condition-tag{display:flex;align-items:center;gap:4px;background:rgba(245,158,11,0.15);padding:4px 8px;border-radius:6px;font-size:10px;color:var(--warning)}
    .cat-condition-tag span{cursor:pointer;color:var(--danger);font-weight:700}

    /* ملخص السعر */
    .price-rows{display:flex;flex-direction:column;gap:6px}
    .price-row{display:flex;align-items:center;height:38px;padding:0 8px;border-radius:6px}
    .price-row-label{display:flex;align-items:center;gap:8px;padding:0 12px;height:30px;border-radius:6px;min-width:155px;font-size:11px;font-weight:600;color:#fff}
    .price-row-label input{width:42px;height:22px;border-radius:6px;border:none;background:rgba(0,0,0,0.3);color:#fff;font-size:10px;font-weight:600;text-align:center;margin-right:auto}
    .price-row-value{flex:1;text-align:left;font-size:12px;font-weight:600}
    .price-divider{border-top:1px dashed #334155;margin:14px 0}
    .price-final{display:flex;justify-content:space-between;align-items:center}
    .price-final-label{font-size:13px;color:#94a3b8}
    .price-final-value{font-size:26px;font-weight:800;color:#fff}
    .price-final-currency{font-size:12px;color:#64748b;margin-right:4px}

    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    /* الملخص النهائي */
    /* ═══════════════════════════════════════════════════════════════════════════════════ */
    .final-summary{background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2));border-radius:6px;padding:24px;border:2px solid rgba(16,185,129,0.5);text-align:center;margin-top:20px}
    .final-summary-label{font-size:14px;color:var(--muted);margin-bottom:8px}
    .final-summary-value{font-size:36px;font-weight:800;color:#fff;margin-bottom:4px}
    .final-summary-currency{font-size:14px;color:var(--success);font-weight:600}
    .final-summary-stats{display:flex;justify-content:center;gap:24px;margin-top:16px;padding-top:16px;border-top:1px dashed var(--border)}
    .final-stat{font-size:12px;color:var(--muted)}
    .final-stat span{color:var(--text);font-weight:600}

    /* Empty State */
    .empty-state{text-align:center;padding:40px 30px;color:var(--muted);background:var(--card);border-radius:6px;border:1px solid var(--border);margin-bottom:16px}
    .empty-icon{font-size:50px;margin-bottom:16px;opacity:0.3}
    .empty-text{font-weight:600;margin-bottom:8px}

    /* Toast */
    .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--success);color:#fff;padding:14px 24px;border-radius:6px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;opacity:0;transition:all 0.3s;z-index:1000;box-shadow:0 10px 30px rgba(16,185,129,0.4)}
    .toast.show{transform:translateX(-50%) translateY(0);opacity:1}
  </style>
</head>
<body>
  <div class="container" id="app"></div>
  <div class="toast" id="toast">✓ تمت الإضافة بنجاح!</div>

  <script>
    // ═══════════════════════════════════════════════════════════════════════════════════
    // البيانات
    // ═══════════════════════════════════════════════════════════════════════════════════
    const workItems = {
      BL: { code: 'BL', name: 'البلاط', icon: '🏠', color: '#3b82f6', items: [
        { num: '01', name: 'بلاط سيراميك 60×60', price: 50 },
        { num: '02', name: 'بلاط بورسلان 120×120', price: 80 },
        { num: '03', name: 'إزالة بلاط قديم', price: 15 },
        { num: '04', name: 'صبة نظافة', price: 20 },
        { num: '05', name: 'تسوية أرضية', price: 25 }
      ]},
      DH: { code: 'DH', name: 'الدهان', icon: '🎨', color: '#8b5cf6', items: [
        { num: '01', name: 'دهان جدران', price: 25 },
        { num: '02', name: 'دهان سقف', price: 20 },
        { num: '03', name: 'معجون', price: 15 },
        { num: '04', name: 'دهان زيتي', price: 35 }
      ]},
      KH: { code: 'KH', name: 'الكهرباء', icon: '⚡', color: '#f59e0b', items: [
        { num: '01', name: 'نقطة إضاءة', price: 150 },
        { num: '02', name: 'نقطة بلك', price: 100 },
        { num: '03', name: 'نقطة تكييف', price: 200 }
      ]},
      SB: { code: 'SB', name: 'السباكة', icon: '🚿', color: '#06b6d4', items: [
        { num: '01', name: 'نقطة ماء', price: 200 },
        { num: '02', name: 'نقطة صرف', price: 180 },
        { num: '03', name: 'تمديد خط', price: 120 }
      ]},
      JB: { code: 'JB', name: 'الجبس', icon: '🏗️', color: '#10b981', items: [
        { num: '01', name: 'جبس بورد عادي', price: 45 },
        { num: '02', name: 'جبس بورد مقاوم', price: 55 },
        { num: '03', name: 'كرانيش', price: 30 }
      ]}
    };

    // الأماكن الافتراضية (قائمة موحدة)
    const defaultPlaces = [
      'المجلس', 'الصالة', 'غرفة النوم الرئيسية', 'غرفة النوم 2', 'غرفة النوم 3', 'غرفة النوم 4',
      'المدخل', 'الممر', 'المكتب', 'غرفة الطعام',
      'الحمام الرئيسي', 'الحمام 2', 'الحمام 3', 'الحمام 4', 'المطبخ', 'غرفة الغسيل',
      'البلكونة', 'السطح', 'الحوش', 'الملحق', 'المستودع', 'غرفة الخادمة', 'غرفة السائق'
    ];
    
    // الأماكن المخصصة (يضيفها المستخدم)
    let customPlaces = [];

    const predefinedConditions = [
      'غير شامل الفك أو الإزالة', 'غير شامل نقل الركام', 'غير شامل المواد', 'غير شامل الحاوية',
      'غير شامل التنظيف', 'غير شامل التمديدات', 'السعر لا يشمل ضريبة القيمة المضافة',
      'المدة المتوقعة للتنفيذ 7 أيام', 'يتطلب معاينة قبل البدء', 'العميل مسؤول عن توفير المواد'
    ];

    const dimOptions = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30];
    const heightOptions = [2,2.5,3,3.5,4,4.5,5,5.5,6];

    // ═══════════════════════════════════════════════════════════════════════════════════
    // الحالة
    // ═══════════════════════════════════════════════════════════════════════════════════
    let state = {
      // نموذج الإدخال السريع
      quickEntryExpanded: true,
      selectedPlaces: [], // مصفوفة لدعم أماكن متعددة
      newPlaceName: '', // لإضافة مكان جديد
      length: 4,
      width: 4,
      height: 3,
      activeMainItems: {},
      selectedSubs: {},
      
      // الفئات
      categories: {},
      expandedCat: null,
      editingItemId: null,
      activeTab: {},
      
      // الشروط
      addingCatCondition: null,
      newCatConditionText: '',
      addingItemCondition: null,
      newItemConditionText: '',
      editingSummary: null,
      customSummary: {}
    };

    // ═══════════════════════════════════════════════════════════════════════════════════
    // الدوال المساعدة
    // ═══════════════════════════════════════════════════════════════════════════════════
    const fmt = n => n.toLocaleString('en-US');
    const genId = () => 'id' + Date.now() + Math.random().toString(36).substr(2,5);
    const getArea = () => state.length * state.width;
    const getAllPlaces = () => [...defaultPlaces, ...customPlaces];
    const getSelectedMainItems = () => Object.keys(state.activeMainItems).filter(k => state.activeMainItems[k]);
    
    const getAllSubItems = () => {
      const subs = [];
      getSelectedMainItems().forEach(code => {
        const config = workItems[code];
        config.items.forEach(item => {
          subs.push({
            mainCode: code,
            code: `${code}${item.num}`,
            name: item.name,
            price: item.price,
            color: config.color
          });
        });
      });
      return subs;
    };
    
    const getSelectedSubsCount = () => Object.values(state.selectedSubs).filter(v => v).length;
    
    const calcCurrentTotal = () => {
      const area = getArea();
      return Object.keys(state.selectedSubs).filter(k => state.selectedSubs[k]).reduce((sum, code) => {
        const sub = getAllSubItems().find(s => s.code === code);
        return sum + (sub ? sub.price * area : 0);
      }, 0);
    };

    const calcPlaceArea = (place) => {
      const type = place.measureType || 'floor';
      const l = place.length || 4;
      const w = place.width || 4;
      const h = place.height || 3;
      switch(type) {
        case 'floor': return l * w;
        case 'ceiling': return l * w;
        case 'walls': return (l + w) * 2 * h;
        case 'linear': return l;
        case 'manual': return place.manualArea || place.area || 0;
        default: return l * w;
      }
    };
    
    const getItemArea = item => item.places?.reduce((sum, p) => sum + (p.area || calcPlaceArea(p)), 0) || 0;
    const getCategoryTotalArea = cat => cat.items?.reduce((sum, item) => sum + getItemArea(item), 0) || 0;
    const getCategoryItemsTotal = cat => cat.items?.reduce((sum, item) => sum + getItemArea(item) * item.price, 0) || 0;
    
    const calcCatTotals = cat => {
      const totalPrice = getCategoryItemsTotal(cat);
      const containerVal = cat.options?.containerState === 'with' ? (cat.options?.containerAmount || 0) : 0;
      const materialsVal = cat.options?.materialsState === 'with' ? (cat.options?.materialsAmount || 0) : 0;
      const baseTotal = totalPrice + containerVal + materialsVal + (cat.options?.customAmount || 0);
      const profitAmount = baseTotal * (cat.options?.profitPercent || 0) / 100;
      const withProfit = baseTotal + profitAmount;
      const discountByPercent = withProfit * (cat.options?.discountPercent || 0) / 100;
      const discountByAmount = cat.options?.discountAmount || 0;
      const afterDiscount = withProfit - discountByPercent - discountByAmount;
      const taxAmount = afterDiscount * (cat.options?.taxPercent || 0) / 100;
      const finalTotal = afterDiscount + taxAmount;
      return { totalPrice, containerVal, materialsVal, baseTotal, profitAmount, withProfit, discountByPercent, discountByAmount, afterDiscount, taxAmount, finalTotal };
    };
    
    const calcGrandTotal = () => Object.values(state.categories).reduce((sum, cat) => sum + calcCatTotals(cat).finalTotal, 0);
    const getTotalPlaces = () => Object.values(state.categories).reduce((sum, cat) => sum + (cat.items?.reduce((s, i) => s + (i.places?.length || 0), 0) || 0), 0);
    const getTotalItems = () => Object.values(state.categories).reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
    const getTotalArea = () => Object.values(state.categories).reduce((sum, cat) => sum + getCategoryTotalArea(cat), 0);
    const hasCategories = () => Object.values(state.categories).some(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0);

    // ═══════════════════════════════════════════════════════════════════════════════════
    // الأحداث - نموذج الإدخال السريع
    // ═══════════════════════════════════════════════════════════════════════════════════
    const toggleQuickEntry = () => { state.quickEntryExpanded = !state.quickEntryExpanded; render(); };
    const addPlaceFromSelect = (name) => { 
      if (name && !state.selectedPlaces.includes(name)) {
        state.selectedPlaces.push(name);
        render();
      }
    };
    const togglePlace = name => { 
      const idx = state.selectedPlaces.indexOf(name);
      if (idx > -1) {
        state.selectedPlaces.splice(idx, 1);
      } else {
        state.selectedPlaces.push(name);
      }
      render(); 
    };
    const removePlace = name => {
      const idx = state.selectedPlaces.indexOf(name);
      if (idx > -1) {
        state.selectedPlaces.splice(idx, 1);
        render();
      }
    };
    const addCustomPlace = () => {
      const name = state.newPlaceName.trim();
      if (name && !getAllPlaces().includes(name) && !state.selectedPlaces.includes(name)) {
        customPlaces.push(name);
        state.selectedPlaces.push(name);
        state.newPlaceName = '';
        render();
      } else if (name && !state.selectedPlaces.includes(name)) {
        state.selectedPlaces.push(name);
        state.newPlaceName = '';
        render();
      }
    };
    const updateDim = (dim, value) => { state[dim] = parseFloat(value) || 1; render(); };
    const toggleMainItem = code => {
      state.activeMainItems[code] = !state.activeMainItems[code];
      if (!state.activeMainItems[code]) {
        Object.keys(state.selectedSubs).forEach(key => {
          if (key.startsWith(code)) delete state.selectedSubs[key];
        });
      }
      render();
    };
    const toggleSub = code => { state.selectedSubs[code] = !state.selectedSubs[code]; render(); };
    
    const addItems = () => {
      if (state.selectedPlaces.length === 0 || getSelectedSubsCount() === 0) return;
      
      const area = getArea();
      const selectedSubCodes = Object.keys(state.selectedSubs).filter(k => state.selectedSubs[k]);
      
      const subsByMain = {};
      selectedSubCodes.forEach(code => {
        const sub = getAllSubItems().find(s => s.code === code);
        if (sub) {
          if (!subsByMain[sub.mainCode]) subsByMain[sub.mainCode] = [];
          subsByMain[sub.mainCode].push({
            id: genId(),
            code: sub.code,
            name: sub.name,
            price: sub.price,
            places: state.selectedPlaces.map(placeName => ({
              id: genId(),
              name: placeName,
              length: state.length,
              width: state.width,
              height: state.height,
              area: area,
              measureType: 'floor'
            })),
            conditions: []
          });
        }
      });
      
      Object.entries(subsByMain).forEach(([mainCode, items]) => {
        const config = workItems[mainCode];
        
        if (!state.categories[mainCode]) {
          state.categories[mainCode] = {
            code: mainCode,
            name: config.name,
            icon: config.icon,
            color: config.color,
            subItems: config.items.map(i => ({ code: `${mainCode}${i.num}`, name: i.name, price: i.price })),
            items: [],
            pendingPlaces: [],
            categoryConditions: [],
            options: {
              containerState: 'notMentioned', containerAmount: 0,
              materialsState: 'notMentioned', materialsAmount: 0,
              showMeters: true, showPlaces: false, showPrice: false,
              customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15
            }
          };
        }
        
        state.categories[mainCode].items.push(...items);
      });
      
      resetForm();
      showToast();
      render();
    };
    
    const resetForm = () => {
      state.selectedPlaces = [];
      state.activeMainItems = {};
      state.selectedSubs = {};
    };

    // ═══════════════════════════════════════════════════════════════════════════════════
    // الأحداث - الفئات والبنود
    // ═══════════════════════════════════════════════════════════════════════════════════
    const toggleCat = catCode => { state.expandedCat = state.expandedCat === catCode ? null : catCode; state.editingItemId = null; render(); };
    const toggleItem = itemId => { state.editingItemId = state.editingItemId === itemId ? null : itemId; render(); };
    const setActiveTab = (catCode, tab) => { state.activeTab[catCode] = tab; render(); };
    
    const updateCatOption = (catCode, field, value) => {
      const cat = state.categories[catCode];
      if (cat) { cat.options[field] = value; render(); }
    };
    
    const changeSubItem = (catCode, itemId, newCode) => {
      const cat = state.categories[catCode];
      if (!cat) return;
      const sub = cat.subItems?.find(s => s.code === newCode);
      if (!sub) return;
      const item = cat.items.find(i => i.id === itemId);
      if (item) {
        item.code = sub.code;
        item.name = sub.name;
        item.price = sub.price;
        render();
      }
    };
    
    const updatePlace = (catCode, itemId, placeId, field, value) => {
      const cat = state.categories[catCode];
      const item = cat?.items.find(i => i.id === itemId);
      const place = item?.places.find(p => p.id === placeId);
      if (place) {
        if (field === 'name' || field === 'measureType') {
          place[field] = value;
        } else if (field === 'manualArea') {
          place.manualArea = parseFloat(value) || 0;
          place.area = place.manualArea;
        } else {
          place[field] = parseFloat(value) || 0;
        }
        if (field !== 'manualArea') {
          place.area = calcPlaceArea(place);
        }
        render();
      }
    };
    
    const addPlaceToItem = (catCode, itemId) => {
      const cat = state.categories[catCode];
      const item = cat?.items.find(i => i.id === itemId);
      if (item) {
        item.places.push({
          id: genId(),
          name: getAllPlaces()[0] || 'مكان',
          length: 4, width: 4, height: 3, area: 16,
          measureType: 'floor'
        });
        render();
      }
    };
    
    const deletePlace = (catCode, itemId, placeId) => {
      const cat = state.categories[catCode];
      const item = cat?.items.find(i => i.id === itemId);
      if (item) {
        item.places = item.places.filter(p => p.id !== placeId);
        render();
      }
    };
    
    const deleteItem = (catCode, itemId) => {
      const cat = state.categories[catCode];
      if (cat) {
        cat.items = cat.items.filter(i => i.id !== itemId);
        if (cat.items.length === 0 && (!cat.pendingPlaces || cat.pendingPlaces.length === 0)) {
          delete state.categories[catCode];
        }
        state.editingItemId = null;
        render();
      }
    };
    
    const duplicateItem = (catCode, itemId) => {
      const cat = state.categories[catCode];
      const item = cat?.items.find(i => i.id === itemId);
      if (item && cat) {
        const newId = genId();
        const newItem = {
          id: newId,
          code: cat.subItems?.[0]?.code || item.code,
          name: cat.subItems?.[0]?.name || item.name,
          price: cat.subItems?.[0]?.price || item.price,
          places: item.places.map(p => ({ ...p, id: genId() })),
          conditions: []
        };
        cat.items.push(newItem);
        state.editingItemId = newId;
        render();
      }
    };
    
    // شروط البند
    const addItemCondition = (catCode, itemId, text) => {
      if (!text?.trim()) return;
      const cat = state.categories[catCode];
      const item = cat?.items.find(i => i.id === itemId);
      if (item && !item.conditions?.includes(text.trim())) {
        if (!item.conditions) item.conditions = [];
        item.conditions.push(text.trim());
        state.newItemConditionText = '';
        state.addingItemCondition = null;
        render();
      }
    };
    
    const deleteItemCondition = (catCode, itemId, index) => {
      const cat = state.categories[catCode];
      const item = cat?.items.find(i => i.id === itemId);
      if (item) {
        item.conditions = item.conditions.filter((_, i) => i !== index);
        render();
      }
    };
    
    // شروط الفئة
    const addCatCondition = (catCode, text) => {
      if (!text?.trim()) return;
      const cat = state.categories[catCode];
      if (cat && !cat.categoryConditions?.includes(text.trim())) {
        if (!cat.categoryConditions) cat.categoryConditions = [];
        cat.categoryConditions.push(text.trim());
        state.newCatConditionText = '';
        state.addingCatCondition = null;
        render();
      }
    };
    
    const deleteCatCondition = (catCode, index) => {
      const cat = state.categories[catCode];
      if (cat) {
        cat.categoryConditions = cat.categoryConditions.filter((_, i) => i !== index);
        render();
      }
    };
    
    const toggleEditSummary = catCode => {
      const cat = state.categories[catCode];
      if (state.editingSummary !== catCode) {
        if (!state.customSummary[catCode] && !cat.customSummary) {
          state.customSummary[catCode] = generateDefaultSummary(cat);
        } else if (cat.customSummary && !state.customSummary[catCode]) {
          state.customSummary[catCode] = cat.customSummary;
        }
      } else {
        cat.customSummary = state.customSummary[catCode] || '';
      }
      state.editingSummary = state.editingSummary === catCode ? null : catCode;
      render();
    };
    
    const generateDefaultSummary = cat => {
      const totals = calcCatTotals(cat);
      let summary = `تشمل الخدمة: ${cat.items?.map(i => {
        let text = cat.options?.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name;
        if (cat.options?.showPlaces) text += ` [${i.places?.map(p => p.name).join('، ')}]`;
        return text;
      }).join('، ')}.`;
      if (cat.categoryConditions?.length > 0) summary += ` | ملاحظات: ${cat.categoryConditions.join('، ')}.`;
      if (cat.options?.containerState === 'with') summary += ` شامل الحاوية (${cat.options?.containerAmount || 0} ﷼).`;
      if (cat.options?.containerState === 'without') summary += ` غير شامل الحاوية.`;
      if (cat.options?.materialsState === 'with') summary += ` شامل المواد (${cat.options?.materialsAmount || 0} ﷼).`;
      if (cat.options?.materialsState === 'without') summary += ` غير شامل المواد.`;
      if (cat.options?.showPrice) summary += ` | الإجمالي: ${fmt(totals.finalTotal)} ﷼`;
      return summary;
    };
    
    const generateColoredSummary = (cat, totals) => {
      let parts = [];
      parts.push('تشمل الخدمة: ');
      cat.items?.forEach((i, idx) => {
        let itemText = `<span class="s-item">${i.name}</span>`;
        if (cat.options?.showMeters) itemText += ` <span class="s-area">(${getItemArea(i)} م²)</span>`;
        if (cat.options?.showPlaces) itemText += ` <span class="s-place">[${i.places?.map(p => p.name).join('، ')}]</span>`;
        if (i.conditions?.length > 0) itemText += ` <span class="s-condition">(${i.conditions.join('، ')})</span>`;
        parts.push(itemText);
        if (idx < cat.items.length - 1) parts.push('، ');
      });
      parts.push('.');
      
      if (cat.categoryConditions?.length > 0) {
        parts.push(` | <span class="s-condition">ملاحظات: ${cat.categoryConditions.join('، ')}.</span>`);
      }
      if (cat.options?.containerState === 'with') {
        parts.push(` <span class="s-container">شامل الحاوية (${cat.options?.containerAmount || 0} ﷼).</span>`);
      }
      if (cat.options?.containerState === 'without') {
        parts.push(` <span class="s-without">غير شامل الحاوية.</span>`);
      }
      if (cat.options?.materialsState === 'with') {
        parts.push(` <span class="s-materials">شامل المواد (${cat.options?.materialsAmount || 0} ﷼).</span>`);
      }
      if (cat.options?.materialsState === 'without') {
        parts.push(` <span class="s-without">غير شامل المواد.</span>`);
      }
      if (cat.options?.showPrice) {
        parts.push(` | <span class="s-price">الإجمالي: ${fmt(totals.finalTotal)} ﷼</span>`);
        if (cat.options?.taxPercent > 0) parts.push(` <span class="s-area">(شامل الضريبة ${cat.options?.taxPercent}%)</span>`);
      }
      return parts.join('');
    };
    
    const resetCatOptions = catCode => {
      const cat = state.categories[catCode];
      if (cat) {
        cat.options = {
          containerState: 'notMentioned', containerAmount: 0,
          materialsState: 'notMentioned', materialsAmount: 0,
          showMeters: true, showPlaces: false, showPrice: false,
          customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15
        };
        cat.categoryConditions = [];
        cat.customSummary = '';
        state.customSummary[catCode] = '';
        state.editingSummary = null;
        render();
      }
    };
    
    const showToast = () => {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    };

    // ═══════════════════════════════════════════════════════════════════════════════════
    // التصيير
    // ═══════════════════════════════════════════════════════════════════════════════════
    const render = () => {
      document.getElementById('app').innerHTML = `
        ${renderQuickEntry()}
        ${hasCategories() ? renderCategories() : renderEmptyState()}
        ${hasCategories() ? renderFinalSummary() : ''}
      `;
    };

    const renderQuickEntry = () => {
      const selectedMains = getSelectedMainItems();
      const allSubs = getAllSubItems();
      const selectedSubsCount = getSelectedSubsCount();
      const currentTotal = calcCurrentTotal();
      const area = getArea();
      const canAdd = state.selectedPlaces.length > 0 && selectedSubsCount > 0;
      const allPlaces = getAllPlaces();
      const availablePlaces = allPlaces.filter(p => !state.selectedPlaces.includes(p));

      return `
        <div class="quick-entry ${state.quickEntryExpanded ? '' : 'collapsed'}">
          <div class="quick-entry-header" onclick="toggleQuickEntry()">
            <div class="icon">📐</div>
            <div class="info">
              <h2>نموذج إدخال سريع</h2>
              <p>🏗️ ${selectedMains.length} بنود مفعّلة | 📍 ${state.selectedPlaces.length} أماكن</p>
            </div>
            <span class="toggle">▼</span>
          </div>
          <div class="quick-entry-body">
            <div class="step-section">
              <div class="step-label">
                <div class="step-num">1</div>
                <span class="step-text">اختر الأماكن</span>
                ${state.selectedPlaces.length > 0 ? `<span class="step-badge">${state.selectedPlaces.length} مكان</span>` : ''}
              </div>
              <div class="place-input-row">
                <select class="place-select-main" onchange="if(this.value){addPlaceFromSelect(this.value);this.value='';}">
                  <option value="">اختر مكان...</option>
                  ${availablePlaces.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
                <input type="text" class="place-custom-input" placeholder="أو اكتب مكان جديد..." value="${state.newPlaceName}" onchange="state.newPlaceName=this.value" onkeydown="if(event.key==='Enter'){addCustomPlace()}">
                <button class="place-add-btn" onclick="addCustomPlace()">+ إضافة</button>
              </div>
              ${state.selectedPlaces.length > 0 ? `
                <div class="selected-places-box">
                  ${state.selectedPlaces.map(p => `<span class="selected-place-tag">${p} <span onclick="removePlace('${p}')">✕</span></span>`).join('')}
                </div>
              ` : ''}
              <div class="dims-row">
                <div class="dim-box"><div class="dim-label">الطول</div><select class="dim-input" onchange="updateDim('length',this.value)">${dimOptions.map(n => `<option value="${n}" ${state.length === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
                <div class="dim-box"><div class="dim-label">العرض</div><select class="dim-input" onchange="updateDim('width',this.value)">${dimOptions.map(n => `<option value="${n}" ${state.width === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
                <div class="dim-box"><div class="dim-label">الارتفاع</div><select class="dim-input" onchange="updateDim('height',this.value)">${heightOptions.map(n => `<option value="${n}" ${state.height === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
                <div class="dim-box area"><div class="dim-label">المساحة</div><div class="dim-value">${area} م²</div></div>
              </div>
            </div>
            
            <div class="step-section">
              <div class="step-label">
                <div class="step-num">2</div>
                <span class="step-text">اختر البنود الرئيسية</span>
                ${selectedMains.length > 0 ? `<span class="step-badge">${selectedMains.length}</span>` : ''}
              </div>
              <div class="main-items-row">
                ${Object.entries(workItems).map(([code, config]) => `
                  <div class="main-item-chip ${state.activeMainItems[code] ? 'active' : ''}" style="--c:${config.color};--cbg:${config.color}20" onclick="toggleMainItem('${code}')">
                    <span class="chip-icon">${config.icon}</span><span>${config.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="sub-items-section ${selectedMains.length > 0 ? 'show' : ''}">
              <div class="sub-items-title">
                <div class="step-num">3</div>
                <span class="step-text">اختر البنود الفرعية</span>
                ${selectedSubsCount > 0 ? `<span class="step-badge">${selectedSubsCount}</span>` : ''}
              </div>
              <div class="sub-items-grid">
                ${allSubs.map(sub => {
                  const isSelected = state.selectedSubs[sub.code];
                  const subTotal = sub.price * area;
                  return `<div class="sub-item-card ${isSelected ? 'selected' : ''}" style="--c:${sub.color};--cbg:${sub.color}15" onclick="toggleSub('${sub.code}')"><div class="sub-item-check">✓</div><div class="sub-item-info"><div class="sub-item-name">${sub.name}</div><div class="sub-item-price">${sub.price} ﷼/م²</div></div><div class="sub-item-total">${fmt(subTotal)} ﷼</div></div>`;
                }).join('')}
              </div>
            </div>
            
            <div class="add-section">
              <div class="add-summary"><span class="add-summary-label">إجمالي البنود المحددة:</span><span class="add-summary-value">${fmt(currentTotal)} ﷼</span></div>
              <button class="add-btn" onclick="addItems()" ${!canAdd ? 'disabled' : ''}><span>➕</span><span>إضافة مكان</span>${selectedSubsCount > 0 ? `<span class="count">${selectedSubsCount} بند</span>` : ''}</button>
            </div>
          </div>
        </div>
      `;
    };

    const renderCategories = () => Object.entries(state.categories).map(([catCode, cat]) => {
      const isExpanded = state.expandedCat === catCode;
      const totals = calcCatTotals(cat);
      const catArea = getCategoryTotalArea(cat);
      const allPlaces = [];
      cat.items?.forEach(item => item.places?.forEach(p => allPlaces.push({ name: p.name, area: p.area })));
      const activeTab = state.activeTab[catCode] || 'conditions';

      return `
        <div class="category ${isExpanded ? 'expanded' : ''}" style="--c:${cat.color}">
          <div class="category-header" onclick="toggleCat('${catCode}')">
            <div class="category-icon-section">
              <div class="category-bar" style="background:${cat.color}"></div>
              <div class="category-icon">
                <span style="font-size:30px">${cat.icon}</span>
                <span class="category-code" style="color:${cat.color}">${cat.code}</span>
              </div>
            </div>
            <div class="category-info">
              <div class="category-name">${cat.name}</div>
              <div class="category-stats">
                <span>📦 ${cat.items?.length || 0} بنود</span>
                ${cat.options?.containerState === 'with' ? `<span style="color:var(--warning)">🚛 حاوية</span>` : ''}
                ${cat.options?.materialsState === 'with' ? `<span style="color:var(--success)">🧱 مواد</span>` : ''}
              </div>
              ${allPlaces.length > 0 ? `
                <div class="category-places-tags">
                  ${allPlaces.map(p => `<span class="category-place-tag" style="background:${cat.color}15">${p.name} (${p.area}م²)</span>`).join('')}
                  <span class="category-place-tag category-total-tag" style="background:rgba(16,185,129,0.2);color:var(--success)">= ${catArea} م²</span>
                </div>
              ` : ''}
            </div>
            <div class="category-total-section">
              <div class="category-total-label">الإجمالي</div>
              <div class="category-total-value">${fmt(totals.finalTotal)}</div>
            </div>
            <div class="category-arrow"><span style="${isExpanded ? 'transform:rotate(180deg)' : ''};color:${isExpanded ? cat.color : 'var(--muted)'}">▼</span></div>
          </div>
          
          ${isExpanded ? `
            <div class="category-body" style="background:${cat.color}05">
              ${renderItems(cat, catCode, totals)}
              ${renderTabs(cat, catCode, totals, activeTab)}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    const renderItems = (cat, catCode, totals) => `
      <div class="items-section">
        <div class="items-header">📦 البنود (${cat.items?.length || 0}) • ${getCategoryTotalArea(cat)} م² • ${fmt(totals.totalPrice)} ﷼</div>
        ${(cat.items || []).map(item => {
          const isEditing = state.editingItemId === item.id;
          const itemArea = getItemArea(item);
          return `
            <div class="item-card ${isEditing ? 'editing' : ''}">
              <div class="item-header" onclick="toggleItem('${item.id}')">
                <div class="item-code-badge" style="background:${cat.color}">${item.code}</div>
                <div class="item-info">
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">📍 ${item.places?.map(p => p.name).join('، ')} | ${itemArea} م² | ${item.price} ﷼/م²</div>
                </div>
                <div class="item-total">${fmt(itemArea * item.price)} ﷼</div>
                <div class="item-header-actions">
                  ${isEditing ? `<div class="item-header-btn item-btn-done" onclick="event.stopPropagation();state.editingItemId=null;render()">✓</div>` : ''}
                  <div class="item-header-btn item-btn-settings">⚙️</div>
                  <div class="item-header-btn item-btn-delete" onclick="event.stopPropagation();deleteItem('${catCode}','${item.id}')">✕</div>
                </div>
              </div>
              ${isEditing ? renderItemEdit(cat, catCode, item) : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    const renderItemEdit = (cat, catCode, item) => `
      <div class="item-body">
        <div class="item-edit-row">
          <select class="item-select" onchange="changeSubItem('${catCode}','${item.id}',this.value)">
            ${(cat.subItems || []).map(s => `<option value="${s.code}" ${item.code === s.code ? 'selected' : ''}>[${s.code}] ${s.name}</option>`).join('')}
          </select>
        </div>
        
        <div class="places-edit-section">
          <div class="places-edit-title">📍 الأماكن</div>
          ${(item.places || []).map(place => {
            const measureType = place.measureType || 'floor';
            return `
              <div class="place-edit-row">
                <select class="place-name-select" onchange="updatePlace('${catCode}','${item.id}','${place.id}','name',this.value)">
                  ${getAllPlaces().map(p => `<option value="${p}" ${place.name === p ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
                <select class="measure-type-select" onchange="updatePlace('${catCode}','${item.id}','${place.id}','measureType',this.value)">
                  <option value="floor" ${measureType === 'floor' ? 'selected' : ''}>أرضي</option>
                  <option value="ceiling" ${measureType === 'ceiling' ? 'selected' : ''}>سقف</option>
                  <option value="walls" ${measureType === 'walls' ? 'selected' : ''}>جدران</option>
                  <option value="linear" ${measureType === 'linear' ? 'selected' : ''}>طولي</option>
                  <option value="manual" ${measureType === 'manual' ? 'selected' : ''}>يدوي</option>
                </select>
                ${measureType === 'manual' ? `
                  <input type="number" class="manual-area-input" value="${place.manualArea || place.area || ''}" onchange="updatePlace('${catCode}','${item.id}','${place.id}','manualArea',this.value)" placeholder="المساحة">
                ` : measureType === 'linear' ? `
                  <div class="dim-box-inline"><span class="dim-label-text">طول:</span><select onchange="updatePlace('${catCode}','${item.id}','${place.id}','length',this.value)">
                    ${[...dimOptions, 40, 50].map(n => `<option value="${n}" ${place.length === n ? 'selected' : ''}>${n}</option>`).join('')}
                  </select><span class="dim-unit">م</span></div>
                ` : `
                  <div class="dim-box-inline"><span class="dim-label-text">طول:</span><select onchange="updatePlace('${catCode}','${item.id}','${place.id}','length',this.value)">
                    ${dimOptions.map(n => `<option value="${n}" ${place.length === n ? 'selected' : ''}>${n}</option>`).join('')}
                  </select><span class="dim-unit">م</span></div>
                  <span class="dim-separator">×</span>
                  <div class="dim-box-inline"><span class="dim-label-text">عرض:</span><select onchange="updatePlace('${catCode}','${item.id}','${place.id}','width',this.value)">
                    ${dimOptions.map(n => `<option value="${n}" ${place.width === n ? 'selected' : ''}>${n}</option>`).join('')}
                  </select><span class="dim-unit">م</span></div>
                `}
                ${['walls', 'floor', 'ceiling'].includes(measureType) ? `
                  <div class="dim-box-inline" style="border-color:var(--purple)"><span class="dim-label-text" style="color:var(--purple)">ارتفاع:</span><select onchange="updatePlace('${catCode}','${item.id}','${place.id}','height',this.value)" style="color:var(--purple)">
                    ${heightOptions.map(n => `<option value="${n}" ${(place.height || 3) === n ? 'selected' : ''}>${n}</option>`).join('')}
                  </select><span class="dim-unit" style="color:var(--purple)">م</span></div>
                ` : ''}
                <span class="area-badge">${place.area} ${measureType === 'linear' ? 'م.ط' : 'م²'}</span>
                <button class="place-delete-btn" onclick="deletePlace('${catCode}','${item.id}','${place.id}')">✕</button>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="conditions-edit-section">
          <div class="conditions-edit-title">📋 الشروط والملاحظات</div>
          ${(item.conditions || []).map((c, i) => `
            <div class="condition-tag"><span>${c}</span><button class="condition-delete-btn" onclick="deleteItemCondition('${catCode}','${item.id}',${i})">✕</button></div>
          `).join('')}
          <div class="condition-add-row">
            <select class="condition-select" onchange="if(this.value){addItemCondition('${catCode}','${item.id}',this.value);this.value='';}">
              <option value="">اختر شرط</option>
              ${predefinedConditions.filter(c => !item.conditions?.includes(c)).map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <button class="manual-condition-btn" onclick="state.addingItemCondition=state.addingItemCondition==='${item.id}'?null:'${item.id}';render()">يدوي</button>
          </div>
          ${state.addingItemCondition === item.id ? `
            <div class="condition-add-row" style="margin-top:8px">
              <input type="text" class="manual-condition-input" placeholder="اكتب الشرط..." onkeydown="if(event.key==='Enter')addItemCondition('${catCode}','${item.id}',this.value)">
              <button class="manual-condition-save" onclick="addItemCondition('${catCode}','${item.id}',this.previousElementSibling.value)">إضافة</button>
            </div>
          ` : ''}
        </div>
        
        </div>
    `;

    const renderTabs = (cat, catCode, totals, activeTab) => `
      <div class="tabs-container">
        <div class="tabs-header">
          <button class="tab-btn ${activeTab === 'conditions' ? 'active' : ''}" style="--c:var(--warning);--cbg:rgba(245,158,11,0.15)" onclick="setActiveTab('${catCode}','conditions')">📋 الشروط والملاحظات</button>
          <button class="tab-btn ${activeTab === 'price' ? 'active' : ''}" style="--c:var(--primary);--cbg:rgba(59,130,246,0.15)" onclick="setActiveTab('${catCode}','price')">💰 ملخص السعر</button>
        </div>
        <div class="tab-content ${activeTab === 'conditions' ? 'active' : ''}">${renderConditionsTab(cat, catCode, totals)}</div>
        <div class="tab-content ${activeTab === 'price' ? 'active' : ''}">${renderPriceTab(cat, catCode, totals)}</div>
      </div>
    `;

    const renderConditionsTab = (cat, catCode, totals) => {
      const cState = cat.options?.containerState;
      const mState = cat.options?.materialsState;
      return `
        <div class="options-grid">
          <div class="option-btn" style="border-color:${cState === 'with' ? 'var(--warning)' : cState === 'without' ? 'var(--danger)' : 'var(--border)'};background:${cState === 'with' ? 'rgba(245,158,11,0.2)' : cState === 'without' ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)'};justify-content:${cState === 'with' ? 'space-between' : 'center'}" onclick="updateCatOption('${catCode}','containerState',['with','notMentioned','without'][(['with','notMentioned','without'].indexOf('${cState || 'notMentioned'}')+1)%3])">
            <span>${cState === 'with' ? '🚛' : cState === 'without' ? '🚫' : '🚛'} ${cState === 'with' ? 'الحاوية' : cState === 'without' ? 'بدون' : 'الحاوية'}</span>
            ${cState === 'with' ? `<input type="number" value="${cat.options?.containerAmount || ''}" onclick="event.stopPropagation()" onchange="updateCatOption('${catCode}','containerAmount',parseFloat(this.value)||0)" placeholder="0">` : ''}
          </div>
          <div class="option-btn" style="border-color:${mState === 'with' ? 'var(--success)' : mState === 'without' ? 'var(--danger)' : 'var(--border)'};background:${mState === 'with' ? 'rgba(16,185,129,0.2)' : mState === 'without' ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)'};justify-content:${mState === 'with' ? 'space-between' : 'center'}" onclick="updateCatOption('${catCode}','materialsState',['with','notMentioned','without'][(['with','notMentioned','without'].indexOf('${mState || 'notMentioned'}')+1)%3])">
            <span>${mState === 'with' ? '🧱' : mState === 'without' ? '🚫' : '🧱'} ${mState === 'with' ? 'المواد' : mState === 'without' ? 'بدون' : 'المواد'}</span>
            ${mState === 'with' ? `<input type="number" value="${cat.options?.materialsAmount || ''}" onclick="event.stopPropagation()" onchange="updateCatOption('${catCode}','materialsAmount',parseFloat(this.value)||0)" placeholder="0">` : ''}
          </div>
          <div class="option-btn" style="border-color:${cat.options?.showMeters ? 'var(--cyan)' : 'var(--border)'};background:${cat.options?.showMeters ? 'rgba(6,182,212,0.2)' : 'rgba(100,116,139,0.15)'}" onclick="updateCatOption('${catCode}','showMeters',!${cat.options?.showMeters})">📏 الأمتار</div>
        </div>
        <div class="options-grid-2">
          <div class="option-btn" style="border-color:${cat.options?.showPlaces ? 'var(--purple)' : 'var(--border)'};background:${cat.options?.showPlaces ? 'rgba(139,92,246,0.2)' : 'rgba(100,116,139,0.15)'}" onclick="updateCatOption('${catCode}','showPlaces',!${cat.options?.showPlaces})">📍 الأماكن</div>
          <div class="option-btn" style="border-color:${cat.options?.showPrice ? 'var(--primary)' : 'var(--border)'};background:${cat.options?.showPrice ? 'rgba(59,130,246,0.2)' : 'rgba(100,116,139,0.15)'}" onclick="updateCatOption('${catCode}','showPrice',!${cat.options?.showPrice})">💰 السعر</div>
          <div class="option-btn" style="border-color:${state.editingSummary === catCode ? 'var(--warning)' : 'var(--border)'};background:${state.editingSummary === catCode ? 'rgba(245,158,11,0.2)' : 'rgba(100,116,139,0.15)'}" onclick="toggleEditSummary('${catCode}')">✏️ ${state.editingSummary === catCode ? 'حفظ' : 'تحرير'}</div>
          <div class="option-btn" style="border-color:var(--danger);background:rgba(239,68,68,0.15)" onclick="resetCatOptions('${catCode}')">🔄 إعادة ضبط</div>
        </div>
        
        <div class="summary-section">
          <div class="summary-title">📝 ملخص الخدمة</div>
          ${state.editingSummary === catCode ? `
            <textarea class="summary-textarea" onchange="state.customSummary['${catCode}']=this.value">${state.customSummary[catCode] || ''}</textarea>
          ` : `
            <div class="summary-text">${state.customSummary[catCode] || cat.customSummary || generateColoredSummary(cat, totals)}</div>
          `}
        </div>
        
        ${cat.categoryConditions?.length > 0 ? `
          <div class="cat-conditions">
            <div class="cat-conditions-title">⚠️ الشروط</div>
            <div class="cat-conditions-tags">
              ${cat.categoryConditions.map((c, i) => `<div class="cat-condition-tag">${c} <span onclick="deleteCatCondition('${catCode}',${i})">×</span></div>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="condition-add-row">
          <select class="condition-select" onchange="if(this.value){addCatCondition('${catCode}',this.value);this.value='';}">
            <option value="">اختر شرط</option>
            ${predefinedConditions.filter(c => !cat.categoryConditions?.includes(c)).map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <button class="manual-condition-btn" onclick="state.addingCatCondition=state.addingCatCondition==='${catCode}'?null:'${catCode}';render()">يدوي</button>
        </div>
        ${state.addingCatCondition === catCode ? `
          <div class="condition-add-row" style="margin-top:8px">
            <input type="text" class="manual-condition-input" placeholder="اكتب الشرط..." onkeydown="if(event.key==='Enter')addCatCondition('${catCode}',this.value)">
            <button class="manual-condition-save" onclick="addCatCondition('${catCode}',this.previousElementSibling.value)">إضافة</button>
          </div>
        ` : ''}
      `;
    };

    const renderPriceTab = (cat, catCode, totals) => `
      <div class="price-rows">
        <div class="price-row" style="background:rgba(100,116,139,0.1)">
          <div class="price-row-label" style="background:rgba(71,85,105,0.3);border:1px solid #475569">الأسعار الأساسية</div>
          <span class="price-row-value" style="color:#94a3b8">${fmt(totals.totalPrice)} ريال</span>
        </div>
        ${cat.options?.containerState === 'with' ? `
          <div class="price-row" style="background:rgba(245,158,11,0.08)">
            <div class="price-row-label" style="background:rgba(245,158,11,0.2);border:1px solid var(--warning)">🚛 الحاوية</div>
            <span class="price-row-value" style="color:var(--warning)">+${fmt(cat.options?.containerAmount || 0)} ريال</span>
          </div>
        ` : ''}
        ${cat.options?.materialsState === 'with' ? `
          <div class="price-row" style="background:rgba(16,185,129,0.08)">
            <div class="price-row-label" style="background:rgba(16,185,129,0.2);border:1px solid var(--success)">🧱 المواد</div>
            <span class="price-row-value" style="color:var(--success)">+${fmt(cat.options?.materialsAmount || 0)} ريال</span>
          </div>
        ` : ''}
        <div class="price-row" style="background:rgba(16,185,129,0.08)">
          <div class="price-row-label" style="background:rgba(16,185,129,0.2);border:1px solid var(--success)">مبلغ إضافي <input type="number" value="${cat.options?.customAmount || ''}" onchange="updateCatOption('${catCode}','customAmount',parseFloat(this.value)||0)" placeholder="0"> ﷼</div>
          <span class="price-row-value" style="color:${(cat.options?.customAmount || 0) > 0 ? 'var(--success)' : '#64748b'}">${(cat.options?.customAmount || 0) > 0 ? '+' + fmt(cat.options?.customAmount) + ' ريال' : '—'}</span>
        </div>
        <div class="price-row" style="background:rgba(16,185,129,0.08)">
          <div class="price-row-label" style="background:rgba(16,185,129,0.2);border:1px solid var(--success)">إضافة نسبة <input type="number" value="${cat.options?.profitPercent || ''}" onchange="updateCatOption('${catCode}','profitPercent',parseFloat(this.value)||0)" placeholder="0"> %</div>
          <span class="price-row-value" style="color:${(cat.options?.profitPercent || 0) > 0 ? 'var(--success)' : '#64748b'}">${(cat.options?.profitPercent || 0) > 0 ? '+' + fmt(totals.profitAmount) + ' ريال' : '—'}</span>
        </div>
        <div class="price-row" style="background:rgba(239,68,68,0.08)">
          <div class="price-row-label" style="background:rgba(239,68,68,0.2);border:1px solid var(--danger)">خصم مبلغ <input type="number" value="${cat.options?.discountAmount || ''}" onchange="updateCatOption('${catCode}','discountAmount',parseFloat(this.value)||0)" placeholder="0"> ﷼</div>
          <span class="price-row-value" style="color:${(cat.options?.discountAmount || 0) > 0 ? 'var(--danger)' : '#64748b'}">${(cat.options?.discountAmount || 0) > 0 ? '-' + fmt(cat.options?.discountAmount) + ' ريال' : '—'}</span>
        </div>
        <div class="price-row" style="background:rgba(239,68,68,0.08)">
          <div class="price-row-label" style="background:rgba(239,68,68,0.2);border:1px solid var(--danger)">خصم نسبة <input type="number" value="${cat.options?.discountPercent || ''}" onchange="updateCatOption('${catCode}','discountPercent',parseFloat(this.value)||0)" placeholder="0"> %</div>
          <span class="price-row-value" style="color:${(cat.options?.discountPercent || 0) > 0 ? 'var(--danger)' : '#64748b'}">${(cat.options?.discountPercent || 0) > 0 ? '-' + fmt(totals.discountByPercent) + ' ريال' : '—'}</span>
        </div>
        <div class="price-row" style="background:rgba(59,130,246,0.1)">
          <div class="price-row-label" style="background:rgba(59,130,246,0.2);border:1px solid var(--primary)">الضريبة <input type="number" value="${cat.options?.taxPercent || ''}" onchange="updateCatOption('${catCode}','taxPercent',parseFloat(this.value)||0)" placeholder="0"> %</div>
          <span class="price-row-value" style="color:${(cat.options?.taxPercent || 0) > 0 ? 'var(--primary)' : '#64748b'}">${(cat.options?.taxPercent || 0) > 0 ? '+' + fmt(totals.taxAmount) + ' ريال' : '—'}</span>
        </div>
      </div>
      <div class="price-divider"></div>
      <div class="price-final">
        <span class="price-final-label">الإجمالي النهائي</span>
        <span class="price-final-value">${fmt(totals.finalTotal)}<span class="price-final-currency">ريال</span></span>
      </div>
    `;

    const renderFinalSummary = () => `
      <div class="final-summary">
        <div class="final-summary-label">💰 الإجمالي الكلي للعرض</div>
        <div class="final-summary-value">${fmt(calcGrandTotal())}</div>
        <div class="final-summary-currency">ريال سعودي</div>
        <div class="final-summary-stats">
          <div class="final-stat">الفئات: <span>${Object.keys(state.categories).length}</span></div>
          <div class="final-stat">البنود: <span>${getTotalItems()}</span></div>
          <div class="final-stat">المساحة: <span>${getTotalArea()} م²</span></div>
        </div>
      </div>
    `;

    const renderEmptyState = () => `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-text">لا توجد فئات مضافة</div>
        <p style="font-size:12px">استخدم نموذج الإدخال السريع أعلاه لإضافة البنود</p>
      </div>
    `;

    // التشغيل
    render();
  </script>
</body>
</html>
