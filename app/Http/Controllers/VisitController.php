<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function index()
    {
        return response()->json(Visit::get());
    }

   public function store(Request $request)
    {

        $visit = Visit::create([
            'patient_id' => $request->patient_id,
            'visit_at' => $request->visit_at ?? now(),
        ]);

        $patient = Patient::findOrFail($request->patient_id);
        $patient->number_of_visit += 1;
        $patient->save();

        return response()->json(['message'=>'Visit created','data'=>$visit], 201);
    }

    public function show($id)
    {
        $visit = Visit::findOrFail($id);
        return response()->json($visit);
    }

    public function update(Request $request, $id)
    {
        $visit = Visit::findOrFail($id);

        $visit->update([
            'patient_id' => $request->patient_id,
            'visit_at' => $request->visit_at ?? $visit->visit_at,
        ]);

        return response()->json(['message'=>'Visit updated','data'=>$visit], 200);
    }
}
