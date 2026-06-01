// Tweaks: palette / font / video layout / motion
const HU_TWEAKS = /*EDITMODE-BEGIN*/{
  "palette": "earth",
  "font": "cormorant",
  "layout": "grid",
  "accentBtns": "ink"
}/*EDITMODE-END*/;

function applyTweaks(t){
  const r = document.documentElement;
  if(t.palette === 'earth') r.removeAttribute('data-palette'); else r.setAttribute('data-palette', t.palette);
  if(t.font === 'cormorant') r.removeAttribute('data-font'); else r.setAttribute('data-font', t.font);
  const g = document.getElementById('gallery');
  if(g) g.setAttribute('data-layout', t.layout);
}

function HUTweaks(){
  const [t, setTweak] = useTweaks(HU_TWEAKS);
  React.useEffect(()=>{ applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Renk Paleti" />
      <TweakColor label="Tema" value={t.palette === 'earth' ? ['#EFE9E1','#33302A','#A8896B'] : t.palette === 'olive' ? ['#F1EEE6','#26302A','#BC9A63'] : ['#1C1916','#ECE3D6','#C79768']}
        options={[['#EFE9E1','#33302A','#A8896B'],['#F1EEE6','#26302A','#BC9A63'],['#1C1916','#ECE3D6','#C79768']]}
        onChange={(v)=>{ const map={'#EFE9E1':'earth','#F1EEE6':'olive','#1C1916':'noir'}; setTweak('palette', map[v[0]]||'earth'); }} />
      <div style={{fontSize:11,letterSpacing:'.04em',opacity:.6,margin:'-2px 0 6px'}}>Toprak · Zeytin · Sinematik Koyu</div>

      <TweakSection label="Tipografi" />
      <TweakRadio label="Font çifti" value={t.font}
        options={['cormorant','marcellus','tenor']}
        onChange={(v)=>setTweak('font', v)} />

      <TweakSection label="Video Düzeni" />
      <TweakRadio label="Dizilim" value={t.layout}
        options={['grid','two','list']}
        onChange={(v)=>setTweak('layout', v)} />
    </TweaksPanel>
  );
}

// apply defaults before mount to avoid flash
applyTweaks(HU_TWEAKS);

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<HUTweaks/>);
