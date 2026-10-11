import Lean
import GameServer.Lean.Structures

open Lean Widget

namespace GameServer

structure CheckHypothesis where
  names : Array String
  type : String
  /-- value of a `let` variable -/
  value : Option String
  /-- the hypothesis is of type `Prop` -/
  isAssumption : Bool
  deriving FromJson, ToJson

structure CheckGoal where
  userName : Option String
  hyps : Array CheckHypothesis
  type : String
  hints : Array GameHint
  deriving FromJson, ToJson

def CheckGoal.ofInteractive (goal : InteractiveGoal) (hints : Array GameHint) : CheckGoal where
  userName := goal.userName?
  type := goal.type.stripTags
  hints := hints
  hyps := goal.hyps.map fun hyp => {
    names := hyp.names
    type := hyp.type.stripTags
    value := hyp.val?.map (·.stripTags)
    isAssumption := hyp.isAssumption?.getD false }

structure CheckDiagnostic where
  /-- 1: error, 2: warning, 3: information, 4: hint -/
  severity : Nat
  message : String
  /-- 0-based line relative to the first tactic -/
  line : Nat
  character : Nat
  deriving FromJson, ToJson

def CheckDiagnostic.ofInteractive (proofStartLine : Nat) (diag : InteractiveDiagnostic) :
    CheckDiagnostic where
  severity := match diag.severity? with
    | some .error | none => 1
    | some .warning => 2
    | some .information => 3
    | some .hint => 4
  message := diag.toDiagnostic.message
  line := diag.range.start.line - proofStartLine
  character := diag.range.start.character

structure CheckStep where
  /-- The tactic of this step. Empty for the initial state. -/
  tactic : String
  /-- The goals after this step. -/
  goals : Array CheckGoal
  diagnostics : Array CheckDiagnostic
  deriving FromJson, ToJson

structure CheckResult where
  /-- The initial state followed by one step per tactic. -/
  steps : Array CheckStep
  /-- No errors and no warnings (e.g. `sorry`). -/
  completed : Bool
  /-- No errors, but there may be warnings. -/
  completedWithWarnings : Bool
  deriving FromJson, ToJson
