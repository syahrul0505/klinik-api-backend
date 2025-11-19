<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::orderBy('no_medical_record','asc')->get();

        $patients->transform(function ($item) {
            try {
                $item->nik = decrypt($item->nik);
            } catch (\Exception $e) {
                // kalau nik belum terenkripsi, biarkan apa adanya
            }
            return $item;
        });

        return response()->json($patients);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name'                  =>'required|string|max:255',
                'nik'                   =>'required',
                'address'               =>'nullable',
            ]);
    
            $mrn = 'MRN' . str_pad((Patient::max('id') + 1), 3, '0', STR_PAD_LEFT);
    
            $patient = Patient::create([
                'no_medical_record' => $mrn,
                'name'              => $request->name,
                'nik'               => encrypt($request->nik),
                'address'           => $request->address,
            ]);
    
            return response()->json(['message'=>'Patient created','data'=>$patient], 201);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'Failed to create patient','error'=>$th->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $patient = Patient::findOrFail($id);

            $request->validate([
                'name'      =>'required|string|max:255',
                'nik'       =>'required',
                'address'   =>'nullable',

            ]);

            $patient->update([
                'name'          => $request->name,
                'nik'           => encrypt($request->nik),
                'address'       => $request->address,
            ]);

            return response()->json(['message'=>'Patient updated','data'=>$patient], 200);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'Failed to update patient','error'=>$th->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $patient = Patient::findOrFail($id);
            $patient->delete();

            return response()->json(['message'=>'Patient deleted'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'Failed to delete patient','error'=>$th->getMessage()], 500);
        }
    }

    public function search($no)
    {
        // Search patient by medical record number
        $patient = Patient::where('no_medical_record', $no)->first();

        if (!$patient) {
            return response()->json([
                'status' => false,
                'message' => 'Patient not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Patient found',
            'data' => $patient
        ]);
    }

}
