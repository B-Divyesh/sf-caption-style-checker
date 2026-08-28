# Demo sandbox

Open `/demo` or `/?demo=1` to enter the sample checker directly. It loads a
three-cue WebVTT lesson intro with speaker markup, emphasis, placement settings,
and one deliberately fast cue.

The banner says **Demo — sample data, nothing is saved**. **Reset demo** reloads
the shipped sample. **Start for real** leaves the demo route. Demo state only
exists in memory; it never reads or writes the real `caption-source` local
storage key. Real mode saves the current pasted source under `caption-source` so
a refresh does not lose it.
