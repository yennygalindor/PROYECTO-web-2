/**
 * Constructor de queries avanzado para MongoDB
 */
class QueryBuilder {
  constructor(model, query) {
    this.model = model;
    this.query = query;
    this.mongooseQuery = model.find();
  }

  /**
   * Aplicar filtros avanzados
   * Soporta: igualdad, comparación, búsqueda de texto, arrays
   */
  filter() {
    const queryObj = { ...this.query };
    
    // Excluir campos especiales de paginación y ordenamiento
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Convertir operadores avanzados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|nin|ne)\b/g, match => `$${match}`);
    
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    
    return this;
  }

  /**
   * Búsqueda de texto en múltiples campos
   */
  search(fields = []) {
    if (this.query.search && fields.length > 0) {
      const searchRegex = new RegExp(this.query.search, 'i');
      const searchConditions = fields.map(field => ({
        [field]: searchRegex
      }));
      
      this.mongooseQuery = this.mongooseQuery.or(searchConditions);
    }
    
    return this;
  }

  /**
   * Ordenamiento
   * Soporta: sort=field o sort=-field (descendente)
   * Múltiples campos: sort=field1,-field2
   */
  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      // Ordenamiento por defecto
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    
    return this;
  }

  /**
   * Selección de campos
   * fields=field1,field2,field3
   */
  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      // Excluir __v por defecto
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    
    return this;
  }

  /**
   * Paginación
   */
  paginate(pagination) {
    const { limit, offset } = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(offset).limit(limit);
    return this;
  }

  /**
   * Ejecutar query
   */
  async execute() {
    return await this.mongooseQuery;
  }

  /**
   * Contar documentos totales (sin paginación)
   */
  async countTotal() {
    return await this.model.countDocuments(this.mongooseQuery.getFilter());
  }
}

/**
 * Helper para aplicar filtros a queries de API externa
 */
const buildApiFilters = (filters, allowedFilters = []) => {
  const params = {};
  
  allowedFilters.forEach(filter => {
    if (filters[filter]) {
      params[filter] = filters[filter];
    }
  });
  
  return params;
};

/**
 * Helper para ordenar arrays en memoria
 */
const sortArray = (array, sortField, sortOrder = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

module.exports = { QueryBuilder, buildApiFilters, sortArray };
