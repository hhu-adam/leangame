import Lean

open Lean Widget

namespace GameServer

def filterUnsolvedGoal (a : Array InteractiveDiagnostic) :
    Array InteractiveDiagnostic :=
  a.filter (fun d =>
    if let .append ⟨(.tag (.expr (.text "unsolved goals")) _) :: _⟩ := d.message
    -- Start and end being the same indicates this diagnostic is for the top
    -- level definition, not something entered by the user so should be ignored
    then d.range.start != d.range.end
    else true
  )
