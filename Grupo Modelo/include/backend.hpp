#pragma once

#include <iostream>
#include <string>
#include <pqxx/pqxx>

using namespace std;
using namespace pqxx;

class Backend {
private:
    connection conn = connection("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

public:
    Backend();

    void insereAdministrador(string Adm_Nome, string Adm_Senha, string Adm_Data, string Adm_Email);
    
    void removeAdministrador(string Adm_Nome);
    
    void insereFuncionario(string Fun_Nome, string Fun_Senha, string Fun_Data, string Fun_Email);
    
    void removeFuncionario(string Fun_Nome);
    
    void insereVeterinario(string Vet_Nome, string Vet_Senha, string Vet_Data, string Vet_Email);
    
    void removeVeterinario(string Vet_Nome);
    
    bool loginAdministrador(const string &Adm_Nome, const string &Adm_Senha);
    
    bool loginFuncionario(const string &Fun_Nome, const string &Fun_Senha);

    bool loginVeterinario(const string &Vet_Nome, const string &Vet_Senha);
};    
