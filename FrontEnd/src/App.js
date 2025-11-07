import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  User, 
  Heart, 
  Star,
  ShoppingCart,
  Loader,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const Sidebar = styled.aside`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  height: fit-content;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInputField = styled.textarea`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #a0aec0;
  width: 18px;
  height: 18px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const PriceInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const PriceInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StatsBar = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
  }
  
  .label {
    font-size: 0.8rem;
    color: #718096;
    font-weight: 500;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 3rem;
  position: relative;
  
  .brand-badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    background: rgba(102, 126, 234, 0.9);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
  }
  
  .heart-icon {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem;
    border-radius: 50%;
    color: #a0aec0;
    transition: all 0.2s ease;
    
    &:hover {
      color: #e53e3e;
      background: white;
    }
  }
`;

const ProductContent = styled.div`
  padding: 1.25rem;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const ProductCategory = styled.span`
  font-size: 0.8rem;
  color: #718096;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
  font-size: 0.8rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
`;

const ProductDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ProductTag = styled.span`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #edf2f7;
  color: #4a5568;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AddToCartButton = styled(Button)`
  flex: 1;
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
`;

const QuickViewButton = styled(SecondaryButton)`
  padding: 0.6rem;
  font-size: 0.9rem;
`;

const RecommendationSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RecommendationText = styled.p`
  color: #4a5568;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
  
  .description {
    font-size: 0.95rem;
  }
`;

function App() {
  const [textQuery, setTextQuery] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    size: '',
    color: '',
    minPrice: '',
    maxPrice: ''
  });
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [etlStatus, setEtlStatus] = useState(null);

  useEffect(() => {
    fetchETLStatus();
  }, []);

  const fetchETLStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/etl/status');
      setEtlStatus(response.data);
    } catch (error) {
      console.error('Error fetching ETL status:', error);
    }
  };

  const handleSearch = async () => {
    if (!textQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/text-query', {
        query: textQuery
      });
      
      setProducts(response.data.results || []);
      setRecommendations(response.data.recommendations || '');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/unified-search', {
        filters: filters
      });
      
      setProducts(response.data.results || []);
    } catch (error) {
      console.error('Error filtering:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshETL = async () => {
    try {
      await axios.post('http://localhost:5000/etl/refresh');
      await fetchETLStatus();
    } catch (error) {
      console.error('Error refreshing ETL:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <div className="logo-icon">
              <ShoppingBag size={18} />
            </div>
            FashionHub
          </Logo>
          <HeaderActions>
            <IconButton onClick={refreshETL}>
              <RefreshCw size={20} />
            </IconButton>
            <IconButton>
              <Heart size={20} />
            </IconButton>
            <IconButton>
              <ShoppingCart size={20} />
            </IconButton>
            <IconButton>
              <User size={20} />
            </IconButton>
          </HeaderActions>
        </HeaderContent>
      </Header>

      <MainContent>
        <Sidebar>
          <SearchSection>
            <SearchInput>
              <SearchIcon />
              <SearchInputField
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="Search for fashion items using natural language... e.g., 'Show me blue shirts under 2000 from Zara'"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </SearchInput>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader size={16} className="spinner" /> : <Search size={16} />}
              Search
            </Button>
          </SearchSection>

          <FilterSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Filter size={16} />
              <span style={{ fontWeight: '600', color: '#2d3748' }}>Filters</span>
            </div>
            
            <FilterGroup>
              <FilterLabel>Brand</FilterLabel>
              <Select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              >
                <option value="">All Brands</option>
                <option value="Van Heusen">Van Heusen</option>
                <option value="Zara">Zara</option>
                <option value="Peter England">Peter England</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Category</FilterLabel>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="shirts">Shirts</option>
                <option value="jeans">Jeans</option>
                <option value="tshirts">T-Shirts</option>
                <option value="jackets">Jackets</option>
                <option value="trousers">Trousers</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Size</FilterLabel>
              <Select
                value={filters.size}
                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              >
                <option value="">Any Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="30">30</option>
                <option value="32">32</option>
                <option value="34">34</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Color</FilterLabel>
              <Select
                value={filters.color}
                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
              >
                <option value="">Any Color</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="grey">Grey</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Price Range</FilterLabel>
              <PriceInputGroup>
                <PriceInput
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <PriceInput
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </PriceInputGroup>
            </FilterGroup>

            <SecondaryButton onClick={handleFilterSearch} disabled={loading}>
              {loading ? <Loader size={16} className="spinner" /> : <Filter size={16} />}
              Apply Filters
            </SecondaryButton>
          </FilterSection>
        </Sidebar>

        <ContentSection>
          {etlStatus && (
            <StatsBar>
              <StatItem>
                <div className="value">{etlStatus.totalUnifiedRecords}</div>
                <div className="label">Total Products</div>
              </StatItem>
              <StatItem>
                <div className="value">{etlStatus.cachedSchemas.length}</div>
                <div className="label">Active Brands</div>
              </StatItem>
              <StatItem>
                <div className="value">{etlStatus.processInterval}min</div>
                <div className="label">Sync Interval</div>
              </StatItem>
              <StatItem>
                <TrendingUp size={24} style={{ color: '#48bb78' }} />
                <div className="label">Live Updates</div>
              </StatItem>
            </StatsBar>
          )}

          {loading ? (
            <LoadingSpinner>
              <Loader size={32} className="spinner" />
            </LoadingSpinner>
          ) : products.length > 0 ? (
            <ProductGrid>
              {products.map((product, index) => (
                <ProductCard key={index}>
                  <ProductImage>
                    <ShoppingBag size={48} />
                    <div className="brand-badge">{product.brand || product.Brand}</div>
                    <Heart size={16} className="heart-icon" />
                  </ProductImage>
                  <ProductContent>
                    <ProductTitle>{product.name || product.item_name || product.product_title}</ProductTitle>
                    <ProductMeta>
                      <ProductCategory>{product.category || product.type}</ProductCategory>
                      <ProductRating>
                        <Star size={12} fill="currentColor" />
                        4.5
                      </ProductRating>
                    </ProductMeta>
                    <ProductPrice>{formatPrice(product.price || product.cost || product.retail_price)}</ProductPrice>
                    <ProductDetails>
                      {product.size && <ProductTag>Size: {product.size}</ProductTag>}
                      {product.color && <ProductTag>Color: {product.color}</ProductTag>}
                      {product.stock && <ProductTag>Stock: {product.stock}</ProductTag>}
                    </ProductDetails>
                    <ProductActions>
                      <AddToCartButton>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </AddToCartButton>
                      <QuickViewButton>
                        <Search size={16} />
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCard>
              ))}
            </ProductGrid>
          ) : (
            <EmptyState>
              <div className="icon">🔍</div>
              <div className="title">Start Your Fashion Discovery</div>
              <div className="description">
                Use the search bar or filters to find amazing fashion items from top brands
              </div>
            </EmptyState>
          )}

          {recommendations && (
            <RecommendationSection>
              <SectionTitle>
                <TrendingUp size={20} />
                Style Recommendations
              </SectionTitle>
              <RecommendationText>{recommendations}</RecommendationText>
            </RecommendationSection>
          )}
        </ContentSection>
      </MainContent>
    </AppContainer>
  );
}

export default App;